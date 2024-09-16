import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../public/fonts/AkcelerAalt-normal";
import "../../public/fonts/AkcelerAalt-bold";
import "../../public/fonts/AkcelerAalt-Medium-normal";
import "../../public/fonts/Satisfy-Regular-normal";

export const generate_PDF = (data) => {
  // Cria um novo documento PDF
  const doc = new jsPDF({
    orientation: "p",
    format: "a4",
  });

  doc.setFont("AkcelerAalt", "normal", "normal");

  const size = (num) => {
    return doc.setFontSize(num);
  };

  const weight = (peso) => {
    switch (peso) {
      case "normal":
        return doc.setFont("AkcelerAalt", "normal", "normal");
      case "bold":
        return doc.setFont("AkcelerAalt-Bold", "normal", "bold");
    }
  };

  //logo
  let img = document.createElement("img");
  img.src = "/logo-horizontal.png";
  img.alt = "Logo da Graxex";

  doc.addImage(img, "PNG", 20, 20, 50, 25);

  doc.setTextColor(40, 40, 40);
  // Cabeçalho
  let inicioCabecalho = 30;
  let label = doc.text("", 0, 0);
  size(24);
  weight("bold");
  doc.text("Graxex Lubrificação", 95, inicioCabecalho);
  size(12);
  weight("bold");
  doc.text("CNPJ:", 95, inicioCabecalho + 5);
  weight("normal");
  doc.text(
    "55.520.215/0001-25",
    label.getTextWidth("CNPJ:") + 95 + 2,
    inicioCabecalho + 5
  );
  weight("bold");
  doc.text("Telefone:", 95, inicioCabecalho + 10);
  weight("normal");
  doc.text(
    "(64)9.9203-2083",
    label.getTextWidth("Telefone:") + 95 + 2,
    inicioCabecalho + 10
  );

  // Título
  // Configuração da fonte e tamanho do título
  doc.setFontSize(24);
  weight("bold");
  doc.text(
    "Relatório de Atendimento de Frota",
    doc.internal.pageSize.getWidth() / 2,
    inicioCabecalho + 35,
    {
      align: "center",
    }
  );

  doc.setDrawColor(200, 200, 200);

  // Cabeçalho cliente
  let inicioCabecalhoCliente = inicioCabecalho + 45;
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
  doc.text(
    data.name,
    label.getTextWidth("Cliente:") + 22 + 2,
    inicioCabecalhoCliente + 7
  );

  if (data.CPFCNPJ && data.CPFCNPJ !== "") {
    weight("normal");
    doc.text("CNPJ/CPF:", 22, inicioCabecalhoCliente + 13);
    weight("bold");
    doc.text(
      data.CPFCNPJ || "",
      label.getTextWidth("CNPJ/CPF:") + 22 + 2,
      inicioCabecalhoCliente + 13
    );
  }

  if (data.address && data.address !== "") {
    weight("normal");
    doc.text("Endereço:", 22, inicioCabecalhoCliente + 19);
    weight("bold");
    doc.text(
      data.address || "",
      label.getTextWidth("Endereço:") + 22 + 2,
      inicioCabecalhoCliente + 19
    );
  }

  doc.line(
    20,
    inicioCabecalhoCliente + 23,
    doc.internal.pageSize.getWidth() - 20,
    inicioCabecalhoCliente + 23
  );

  size(12);
  weight("normal");

  doc.text(
    Intl.DateTimeFormat("pt-br", { dateStyle: "full" }).format(
      new Date(Date.now())
    ),
    doc.internal.pageSize.getWidth() - 20,
    inicioCabecalhoCliente + 30,
    { align: "right" }
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
      item.frota,
      `${item.fabricante}\n${item.modelo}`,
      dataUltAgend,
      numDias,
    ];
  });

  let inicioTabela = inicioCabecalhoCliente + 32;

  /*   doc.autoTable({
    dados: dados,
    afterPageContent: function (data) {
      // Calcular a posição do rodapé
      const str = `"Nossa missão é levar conveniência, aumentar a durabilidade e maximizar sua eficiência."`;
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height
        ? pageSize.height
        : pageSize.getHeight();
      const position = pageHeight - 20; // Ajustar a posição conforme necessário

      // Adicionar o rodapé
      doc.setFontSize(15);
      doc.setFont("Satisfy-Regular", "normal", "normal");
      doc.text(str, 20, position, {
        maxWidth: doc.internal.pageSize.getWidth() - 40,
      });
    },
  }); */

  autoTable(doc, {
    head: [["Placa", "Frota", "Veículo", "Ultimo atendimento", "Dias"]],
    body: dados,
    tableWidth: doc.internal.pageSize.getWidth() - 40,
    startY: inicioTabela,
    margin: { left: 20, right: 20 },
    styles: {
      fontSize: 14,
      font: "AkcelerAalt",
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      halign: "center",
      valign: "middle",
      font: "AkcelerAalt-Medium",
      fillColor: [242, 133, 54],
    },
    columnStyles: {
      0: {
        font: "AkcelerAalt-Medium",
      },
      2: {
        cellWidth: 65,
      },
      4: {
        font: "AkcelerAalt-Medium",
        textColor: [238, 78, 54],
      },
    },
    alternateRowStyles: {
      fillColor: [225, 225, 225],
    },
    afterPageContent: function (data) {
      // Calcular a posição do rodapé
      const str = `"Nossa missão é levar conveniência, aumentar a durabilidade e maximizar sua eficiência."`;
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height
        ? pageSize.height
        : pageSize.getHeight();
      const position = pageHeight - 10; // Ajustar a posição conforme necessário

      // Adicionar o rodapé
      doc.setFontSize(13);
      doc.setTextColor(242, 133, 54);
      doc.setFont("Satisfy-Regular", "normal", "normal");
      doc.text(str, doc.internal.pageSize.getWidth() / 2, position, {
        align: "center",
        maxWidth: doc.internal.pageSize.getWidth() - 40,
      });
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

  //window.open(doc.output("bloburi", { filename: "Relação de atendimentos" }));
  setTimeout(() => {
    doc.save(
      `Situação de frota - ${data.name} - ${Intl.DateTimeFormat("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
        .format(new Date(Date.now()).setUTCHours(12))
        .replace(/\//g, "_")}`
    );
  }, 400);
};
