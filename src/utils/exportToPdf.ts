
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Question } from '@/types/department';

export const exportToPdf = async () => {
  try {
    const reportElement = document.querySelector('[data-report-content]') as HTMLElement | null;

    if (!reportElement) {
      window.location.assign('/report');
      return;
    }

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0A0A0A',
      windowWidth: reportElement.scrollWidth,
      onclone: (clonedDocument) => {
        clonedDocument.querySelectorAll('[data-print-hide]').forEach((element) => {
          (element as HTMLElement).style.display = 'none';
        });
      },
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight - margin * 2;
    }

    const clientName = reportElement.querySelector('[data-client-name]')?.textContent?.replace('Cliente: ', '') || 'diagnostico-360';
    const fileName = clientName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    pdf.save(`relatorio-${fileName || 'diagnostico-360'}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
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
