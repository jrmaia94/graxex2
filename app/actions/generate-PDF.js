import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generate_PDF = (data) => {
  console.log(data);
  // Cria um novo documento PDF
  const doc = new jsPDF();

  const size = (num) => {
    return doc.setFontSize(num);
  };

  const weight = (peso) => {
    switch (peso) {
      case "normal":
        return doc.setFont("helvetica", "normal", "normal");
      case "bold":
        return doc.setFont("helvetica", "normal", "bold");
    }
  };

  //logo
  let img = document.createElement("img");
  img.src = "/logo-horizontal.png";
  img.alt = "Logo da Graxex";

  doc.addImage(img, "PNG", 20, 20, 50, 25);

  doc.setTextColor(30, 30, 30);
  // Cabeçalho
  let inicioCabecalho = 30;
  size(24);
  weight("bold");
  doc.text("Graxex Lubrificação", 95, inicioCabecalho);
  size(12);
  weight("bold");
  doc.text("CNPJ:", 95, inicioCabecalho + 5);
  weight("normal");
  doc.text("55.520.215/0001-25", 108, inicioCabecalho + 5);
  weight("bold");
  doc.text("Telefone:", 95, inicioCabecalho + 10);
  weight("normal");
  doc.text("(64)9.9203-2083", 114, inicioCabecalho + 10);

  // Título
  // Configuração da fonte e tamanho do título
  doc.setFontSize(22);
  weight("bold");
  doc.text(
    "Relatório de Atendimento de Frota",
    doc.internal.pageSize.getWidth() / 2,
    65,
    {
      align: "center",
    }
  );
  doc.setDrawColor(200, 200, 200);

  // Cabeçalho cliente
  let inicioCabecalhoCliente = 70;
  doc.line(
    20,
    inicioCabecalhoCliente,
    doc.internal.pageSize.getWidth() - 20,
    inicioCabecalhoCliente
  );

  size(14);
  weight("normal");
  doc.text("Cliente:", 22, inicioCabecalhoCliente + 7);
  weight("bold");
  doc.text(data.name, 40, inicioCabecalhoCliente + 7);

  weight("normal");
  doc.text("CNPJ/CPF:", 22, inicioCabecalhoCliente + 13);
  weight("bold");
  doc.text(data.CPFCNPJ || "", 48, inicioCabecalhoCliente + 13);

  weight("normal");
  doc.text("Endereço:", 22, inicioCabecalhoCliente + 19);
  weight("bold");
  doc.text(data.address || "", 46, inicioCabecalhoCliente + 19);

  doc.line(
    20,
    inicioCabecalhoCliente + 23,
    doc.internal.pageSize.getWidth() - 20,
    inicioCabecalhoCliente + 23
  );

  // Tabela
  const dados = data.veiculos.map((item) => {
    let dataUltAgend = "--";
    let numDias = 0;
    if (item.agendamentos.length === 0) {
      dataUltAgend = "--";
      numDias = "Nunca foi atendido";
    } else if (item.agendamentos.length === 1) {
      if (item.agendamentos[0].agendamento.serviceCompleted) {
        dataUltAgend = Intl.DateTimeFormat("pt-br", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(item.agendamentos[0].agendamento.serviceCompleted);
        numDias = parseInt(
          (new Date(Date.now()) -
            new Date(item.agendamentos[0].agendamento.serviceCompleted)) /
            1000 /
            60 /
            60 /
            24
        );
      } else {
        dataUltAgend = "";
        numDias = "Nunca foi atendido";
      }
    } else if (item.agendamentos.length > 1) {
      let agendamentosCompleted = [];
      item.agendamentos.forEach((item) => {
        if (item.agendamento.serviceCompleted) {
          agendamentosCompleted.push(item.agendamento);
        }
      });

      if (agendamentosCompleted.length > 0) {
        dataUltAgend = Intl.DateTimeFormat("pt-br", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(
          agendamentosCompleted
            .sort((a, b) => {
              return b - a;
            })[0]
            .serviceCompleted.getTime()
        );
        numDias = parseInt(
          (new Date(Date.now()) -
            new Date(
              agendamentosCompleted.sort((a, b) => {
                return b - a;
              })[0].serviceCompleted
            )) /
            1000 /
            60 /
            60 /
            24
        );
      } else {
        dataUltAgend = "Nunca foi atendido";
        numDias = "";
      }
    }

    return [
      item.placa,
      `${item.fabricante}\n${item.modelo}`,
      dataUltAgend,
      numDias,
    ];
  });

  let inicioTabela = 100;

  autoTable(doc, {
    head: [["Placa", "Veículo", "Ultimo atendimento", "Dias"]],
    body: dados,
    tableWidth: doc.internal.pageSize.getWidth() - 40,
    startY: inicioTabela,
    margin: { left: 20, right: 20 },
    styles: {
      fontSize: 14,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      halign: "center",
      valign: "middle",
      fillColor: [242, 133, 54],
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
      },
      1: {
        cellWidth: 65,
      },
      3: {
        fontStyle: "bold",
        textColor: [238, 78, 54],
      },
    },
    alternateRowStyles: {
      fillColor: [225, 225, 225],
    },
  });

  size(10);
  doc.setTextColor(238, 78, 54);
  //doc.text(
  //  `"Nossa missão é levar conveniência, aumentar a durabilidade e maximizar sua eficiência."`,
  //  doc.internal.pageSize.getWidth() / 2,
  //  doc.internal.pageSize.getHeight() - 20,
  //  {
  //    maxWidth: doc.internal.pageSize.getWidth() - 40,
  //    align: "center",
  //  }
  //);

  window.open(doc.output("bloburi"));
};
