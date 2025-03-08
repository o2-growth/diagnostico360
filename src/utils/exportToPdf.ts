
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Question } from '@/types/department';

export const exportToPdf = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let currentY = 10;
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Função helper para adicionar texto com quebra de linha
  const addWrappedText = (text: string, y: number) => {
    const splitText = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    pdf.text(splitText, margin, y);
    return y + (splitText.length * 7);
  };

  // Função helper para capturar elemento e adicionar ao PDF
  const captureElement = async (element: HTMLElement, title: string) => {
    if (!element) return currentY;

    // Adiciona o título da seção
    currentY = addWrappedText(title, currentY);
    currentY += 5;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    // Calcula as dimensões da imagem mantendo a proporção
    const imgWidth = pageWidth - (2 * margin);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Verifica se precisa de uma nova página
    if (currentY + imgHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
    currentY += imgHeight + 10;

    return currentY;
  };

  try {
    // Captura os gráficos e recomendações de cada departamento
    const departments = document.querySelectorAll('[data-department]');
    
    for (const dept of Array.from(departments)) {
      const deptName = dept.getAttribute('data-department');
      
      // Adiciona uma nova página para cada departamento (exceto o primeiro)
      if (currentY > margin) {
        pdf.addPage();
        currentY = margin;
      }

      // Título do departamento
      currentY = addWrappedText(`Departamento: ${deptName}`, currentY);
      currentY += 10;

      // Captura os gráficos
      const charts = dept.querySelectorAll('[data-chart]');
      for (const chart of Array.from(charts)) {
        currentY = await captureElement(chart as HTMLElement, 'Gráfico: ' + chart.getAttribute('data-chart'));
      }

      // Captura as recomendações
      const recommendations = dept.querySelector('[data-recommendations]');
      if (recommendations) {
        currentY = await captureElement(recommendations as HTMLElement, 'Recomendações');
      }
    }

    // Salva o PDF
    pdf.save('relatorio-departamentos.pdf');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
  }
};

export const exportQuestionsAsPdf = async (questions: Question[], departmentName?: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let currentY = 10;
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Função helper para adicionar texto com quebra de linha
  const addWrappedText = (text: string, y: number, fontSize: number = 10, isBold: boolean = false) => {
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.setFontSize(fontSize);
    const splitText = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    pdf.text(splitText, margin, y);
    return y + (splitText.length * (fontSize * 0.5));
  };

  try {
    // Adicionar título do relatório
    currentY = addWrappedText(`Relatório de Checklist${departmentName ? ` - ${departmentName}` : ''}`, currentY, 18, true);
    currentY += 10;

    // Adicionar data do relatório
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    currentY = addWrappedText(`Data: ${formattedDate}`, currentY);
    currentY += 10;

    // Carregar respostas salvas
    const storedAnswers = localStorage.getItem('departmentAnswers');
    const savedAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};

    // Para cada pergunta
    for (const question of questions) {
      const savedAnswer = savedAnswers[question.item] || {};
      
      // Verificar se precisamos adicionar uma nova página
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = margin;
      }

      // Adicionar item e título da pergunta
      currentY = addWrappedText(`${question.item} - ${question.title}`, currentY, 12, true);
      currentY += 2;

      // Adicionar a pergunta
      if (question.question) {
        currentY = addWrappedText(`Pergunta: ${question.question}`, currentY);
        currentY += 2;
      }

      // Adicionar respostas
      currentY = addWrappedText(`Aplicável: ${savedAnswer.applicable || question.applicable || "SIM"}`, currentY);
      currentY += 2;

      currentY = addWrappedText(`Evidência: ${savedAnswer.hasEvidence || question.hasEvidence || "NÃO"}`, currentY);
      currentY += 2;

      currentY = addWrappedText(`Avaliação: ${savedAnswer.evaluation || question.evaluation || "NÃO EXISTE"}`, currentY);
      currentY += 2;

      if (question.evidence) {
        currentY = addWrappedText(`Evidências Sugeridas: ${question.evidence}`, currentY);
        currentY += 2;
      }

      // Adicionar linha separadora
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 8;
    }

    // Salvar o PDF
    pdf.save(`relatorio-checklist${departmentName ? `-${departmentName}` : ''}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF de perguntas:', error);
    throw error;
  }
};
