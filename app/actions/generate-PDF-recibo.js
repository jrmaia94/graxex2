import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../public/fonts/AkcelerAalt-normal";
import "../../public/fonts/AkcelerAalt-bold";
import "../../public/fonts/AkcelerAalt-Medium-normal";
import "../../public/fonts/Satisfy-Regular-normal";
import "../../public/fonts/WorkSans-Bold-bold";
import "../../public/fonts/WorkSans-Italic-italic";
import "../../public/fonts/WorkSans-Regular-normal";
import "../../public/fonts/WorkSans-SemiBold-bold";

export const generate_PDF_recibo = (data) => {
  // Cria um novo documento PDF
  const doc = new jsPDF({
    orientation: "p",
    format: "a4",
  });

  doc.setFont("WorkSans-Regular", "normal", "normal");

  const size = (num) => {
    return doc.setFontSize(num);
  };

  const weight = (peso) => {
    switch (peso) {
      case "normal":
        return doc.setFont("WorkSans-Regular", "normal", "normal");
      case "semi-bold":
        return doc.setFont("WorkSans-SemiBold", "normal", "bold");
      case "bold":
        return doc.setFont("WorkSans-Bold", "normal", "bold");
    }
  };

  /* Início do cabeçalho */

  doc.setDrawColor(40, 40, 40);

  doc.roundedRect(10, 10, doc.internal.pageSize.getWidth() - 20, 47, 3, 3);
  //logo
  let img = document.createElement("img");
  img.src = "/logo-vertical.png";
  img.alt = "Logo da Graxex";

  doc.addImage(img, "PNG", 12, 13, 32, 42);

  doc.setTextColor(40, 40, 40);
  // Cabeçalho
  let inicioCabecalho = 23;
  let label = doc.text("", 0, 0);
  size(36);
  weight("bold");
  doc.text("GRAXEX LUBRIFICAÇÃO", 47, inicioCabecalho);
  size(17);
  weight("semi-bold");
  doc.text(
    "Lubrificação em Caminhões e Máquinas Agrícolas",
    48,
    inicioCabecalho + 8
  );
  doc.text("CNPJ:", 82, inicioCabecalho + 14);
  doc.text(
    "55.520.215/0001-25",
    label.getTextWidth("CNPJ:") + 82 + 2,
    inicioCabecalho + 14
  );

  let imgWpp = document.createElement("img");
  imgWpp.src = "/wpp-icon.png";
  imgWpp.alt = "Logo whatsapp";

  doc.addImage(imgWpp, "PNG", 50, inicioCabecalho + 15, 10, 10);
  weight("normal");
  size(12);
  doc.text("(64)", 61, inicioCabecalho + 22);
  size(20);
  weight("semi-bold");
  doc.text(
    "99203-2083",
    label.getTextWidth("(64)") + 56,
    inicioCabecalho + 22.5
  );
  weight("normal");
  doc.text(
    "|",
    label.getTextWidth("(64)99203-2083") + 58,
    inicioCabecalho + 22
  );
  let imgInsta = document.createElement("img");
  imgInsta.src = "/insta-icon.png";
  imgInsta.alt = "Logo instagram";

  doc.addImage(imgInsta, "PNG", 116, inicioCabecalho + 15.5, 10, 10);
  weight("semi-bold");
  doc.text("graxex.lubrificacao", 127, inicioCabecalho + 22.5);
  size(14.88);
  weight("normal");
  doc.text(
    "Rua Adalto Fernandes, 19 - Aparecida do Rio Doce - GO",
    50,
    inicioCabecalho + 30
  );
  /* Final do cabeçalho */

  /* Cabeçalho cliente */

  doc.roundedRect(10, 58, doc.internal.pageSize.getWidth() - 20, 45, 3, 3);

  let inicioCabecalhoCliente = inicioCabecalho + 42;
  doc.setFont("sans-serif", "normal", "bold");
  size(14);
  doc.text("ORÇAMENTO", 13, inicioCabecalhoCliente);
  doc.rect(48, inicioCabecalhoCliente - 4.5, 6, 6);

  doc.text("PEDIDO", 60, inicioCabecalhoCliente);
  doc.rect(81, inicioCabecalhoCliente - 4.5, 6, 6);

  size(20);
  doc.setFont("Helvetica", "normal", "normal");
  doc.setTextColor(230, 30, 30);
  doc.text(
    "Nº 0187",
    doc.internal.pageSize.getWidth() - 14,
    inicioCabecalhoCliente,
    {
      align: "right",
    }
  );

  doc.setTextColor(40, 40, 40);

  size(17);
  weight("normal");

  doc.text(
    Intl.DateTimeFormat("pt-br", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(Date.now())),
    doc.internal.pageSize.getWidth() - 14,
    inicioCabecalhoCliente + 10,
    { align: "right" }
  );

  size(12);
  doc.setFont("sans-serif", "normal", "normal");
  doc.text("Cliente:", 14, inicioCabecalhoCliente + 17);
  size(17);
  weight("normal");
  doc.text(data?.cliente.name || "", 28, inicioCabecalhoCliente + 17);
  doc.setDrawColor(100, 100, 100);
  doc.line(
    28,
    inicioCabecalhoCliente + 17.5,
    doc.internal.pageSize.getWidth() - 12,
    inicioCabecalhoCliente + 17.5
  );

  size(12);
  doc.setFont("sans-serif", "normal", "normal");
  doc.text("Endereço:", 14, inicioCabecalhoCliente + 26);
  size(17);
  weight("normal");
  doc.text(data?.cliente.address || "", 32, inicioCabecalhoCliente + 26);
  doc.setDrawColor(100, 100, 100);
  doc.line(
    32,
    inicioCabecalhoCliente + 26.5,
    doc.internal.pageSize.getWidth() - 12,
    inicioCabecalhoCliente + 26.5
  );

  size(12);
  doc.setFont("sans-serif", "normal", "normal");
  doc.text("CPF/CNPJ:", 14, inicioCabecalhoCliente + 35);
  size(17);
  weight("normal");
  doc.text(data?.cliente.CPFCNPJ || "", 34, inicioCabecalhoCliente + 35);
  doc.setDrawColor(100, 100, 100);
  doc.line(
    34,
    inicioCabecalhoCliente + 35.5,
    doc.internal.pageSize.getWidth() / 2,
    inicioCabecalhoCliente + 35.5
  );

  size(12);
  doc.setFont("sans-serif", "normal", "normal");
  doc.text(
    "Fone:",
    doc.internal.pageSize.getWidth() / 2 + 2,
    inicioCabecalhoCliente + 35
  );
  size(17);
  weight("normal");
  doc.text(
    data?.cliente.phone || "",
    doc.internal.pageSize.getWidth() / 2 + 12,
    inicioCabecalhoCliente + 35
  );
  doc.setDrawColor(100, 100, 100);
  doc.line(
    doc.internal.pageSize.getWidth() / 2 + 12,
    inicioCabecalhoCliente + 35.5,
    doc.internal.pageSize.getWidth() - 12,
    inicioCabecalhoCliente + 35.5
  );

  /* doc.line(
    20,
    inicioCabecalhoCliente,
    doc.internal.pageSize.getWidth() - 20,
    inicioCabecalhoCliente
  ); */

  /* if (data.cliente.CPFCNPJ && data.cliente.CPFCNPJ !== "") {
    weight("normal");
    doc.text("CNPJ/CPF:", 22, inicioCabecalhoCliente + 13);
    weight("bold");
    doc.text(
      data.cliente.CPFCNPJ || "",
      label.getTextWidth("CNPJ/CPF:") + 22 + 2,
      inicioCabecalhoCliente + 13
    );
  } */

  /*  if (data.cliente.address && data.cliente.address !== "") {
    weight("normal");
    doc.text("Endereço:", 22, inicioCabecalhoCliente + 19);
    weight("bold");
    doc.text(
      data.cliente.address || "",
      label.getTextWidth("Endereço:") + 22 + 2,
      inicioCabecalhoCliente + 19
    );
  } */

  console.log(data);

  // Tabela
  let cont = 0;
  const dados = data?.veiculos.map((item) => {
    cont += 1;
    let veiculo = item.veiculo;
    let price = Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    })
      .format(
        data.pricePerVeiculo.find((e) => e.veiculoId === veiculo.id)?.price
      )
      .replace("R$", "")
      .trim();
    return [
      cont,
      veiculo.frota,
      veiculo.placa,
      `${veiculo.fabricante} - ${veiculo.modelo}`,
      `R$ ${price}`,
    ];
  });

  const dados2 = data?.pricePerVeiculo.map((item) => {});

  if (dados)
    for (let i = 0; i <= 10; i++) {
      if (!dados[i]) {
        dados.push(["", "", "", "", ""]);
      }
    }

  let inicioTabela = inicioCabecalhoCliente + 39;

  doc.setDrawColor(40, 40, 40);

  /* Desenhar tabela (pra conseguir bordas arredondadas) */

  doc.roundedRect(
    10,
    inicioTabela,
    doc.internal.pageSize.getWidth() - 20,
    98,
    3,
    3
  );

  autoTable(doc, {
    head: [["Seq.", "Frota", "Placa", "Veículo", "Preço"]],
    body: dados,
    theme: "plain",
    tableWidth: doc.internal.pageSize.getWidth() - 20,
    startY: inicioTabela,
    margin: { left: 10, right: 10 },
    styles: {
      fontSize: 12,
      font: "WorkSans-Regular",
      fontStyle: "normal",
      textColor: (20, 20, 20),
      halign: "center",
      valign: "middle",
    },
    bodyStyles: {},
    headStyles: {
      halign: "center",
      valign: "middle",
      fontSize: 14,
      font: "WorkSans-SemiBold",
      fontStyle: "bold",
      textColor: (20, 20, 20),
    },
    columnStyles: {
      0: {},
      1: {},
      2: {},
      3: {
        cellWidth: 100,
      },
      4: {},
    },
    didDrawCell: (e) => {
      doc.setDrawColor(20, 20, 20);
      if (e.column.index !== 4) {
        doc.line(
          e.cell.x + e.cell.width,
          e.cell.y,
          e.cell.x + e.cell.width,
          e.cell.y + e.cell.height
        );
      }
      if (true /* e.row.index !== 10 */) {
        doc.line(
          e.cell.x,
          e.cell.y + e.cell.height,
          e.cell.x + e.cell.width,
          e.cell.y + e.cell.height
        );
      }
    },
    afterPageContent: function () {
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

  window.open(doc.output("bloburi", { filename: "Relação de atendimentos" }));
  /*   setTimeout(() => {
    doc.save(
      `Situação de frota - ${data.name} - ${Intl.DateTimeFormat("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
        .format(new Date(Date.now()).setUTCHours(12))
        .replace(/\//g, "_")}`
    );
  }, 400); */
};
