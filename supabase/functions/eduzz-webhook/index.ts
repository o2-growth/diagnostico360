import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generatePassword(length = 12): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Eduzz pode enviar como array ou objeto
    const payload = Array.isArray(body) ? body[0] : body;
    const eventBody = payload?.body ?? payload;

    const event = eventBody?.event;
    if (event !== "myeduzz.invoice_paid") {
      console.log("Evento ignorado:", event);
      return new Response(JSON.stringify({ message: "Evento ignorado" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buyerEmail = eventBody?.data?.buyer?.email;
    const buyerName = eventBody?.data?.buyer?.name;

    if (!buyerEmail) {
      console.error("Email do comprador não encontrado no payload");
      return new Response(
        JSON.stringify({ error: "Email do comprador não encontrado" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const password = generatePassword();
    let userId: string | null = null;

    // Tentar criar o usuário
    const { data: createData, error: createError } =
      await supabase.auth.admin.createUser({
        email: buyerEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: buyerName },
      });

    if (createError) {
      // Usuário já existe — buscar pelo email
      if (
        createError.message?.includes("already been registered") ||
        createError.message?.includes("already exists")
      ) {
        console.log("Usuário já existe, atualizando has_paid:", buyerEmail);

        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingUser = listData?.users?.find(
          (u: any) => u.email === buyerEmail
        );

        if (existingUser) {
          userId = existingUser.id;

          // Atualizar senha para a nova gerada
          await supabase.auth.admin.updateUserById(userId, { password });
        }
      } else {
        console.error("Erro ao criar usuário:", createError.message);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      userId = createData.user.id;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Não foi possível obter o ID do usuário" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Aguardar um momento para o trigger handle_new_user criar o profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Atualizar has_paid = true
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ has_paid: true })
      .eq("id", userId);

    if (updateError) {
      console.error("Erro ao atualizar has_paid:", updateError.message);
    }

    // Enviar credenciais para webhook externo
    try {
      const webhookResponse = await fetch(
        "https://webhook.aio2.com.br/webhook/envio-login-diagnostico",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: buyerEmail,
            password,
            name: buyerName,
          }),
        }
      );
      console.log(
        "Webhook externo respondeu:",
        webhookResponse.status
      );
    } catch (webhookErr) {
      console.error("Erro ao enviar para webhook externo:", webhookErr);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Usuário processado" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erro geral:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
