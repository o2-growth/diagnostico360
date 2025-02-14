
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
