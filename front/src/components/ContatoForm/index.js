import React from "react";
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";

function ContatoForm() {
  return (
    <div className={styles.page}>
      <VoltarButton />
      <div className={styles.container}>
        <div className={styles.titulo}>
          <h1> Contato</h1>
        </div>

        <div>
          <h5>HOSPITAL VETERINÁRIO UNIVERSITÁRIO (HVU)</h5>
          <h6>
            <span>Universidade Federal do Agreste de Pernambuco - UFAPE</span>
            <br />
            <span>
              Avenida Bom Pastor, s/n.º, Bairro Boa Vista - CEP: 55292-270 -
              Garanhuns - PE
            </span>
            <br />
            <span>E-mail: direcao.hospveterinario@ufape.edu.br</span>
            <br />
            <span>Contato: (087) 3764-5585</span>
            <br />
            <span>WhatsApp: (87) 99146-5277</span>
            <br />
            <div className={styles.whatsapp_link}>
              <a
                href="https://chat.whatsapp.com/KX4qqcuMXVuFEMiDxTbklJ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsapp_button}
              >
                Acesse nosso grupo de suporte no WhatsApp
              </a>
            </div>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default ContatoForm;
