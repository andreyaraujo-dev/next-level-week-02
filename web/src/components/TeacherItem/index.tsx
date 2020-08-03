import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

const TeacherItem = () => {
  return (
    <article className="teacher-item">
      <header>
        <img src="https://avatars0.githubusercontent.com/u/31444727?s=460&u=3a8890fd92b03ba748117b8f2ea58fca0d3d3504&v=4" alt="Jacksson Andrey"/>
        <div>
          <strong>Jacksson Andrey</strong>
          <span>Desenvolvimento Web</span>
        </div>
      </header>
      <p>
        Apaixonado por tecnologia e repassar conhecimento, ja formou mais de 10.000 alunos. Em suas aulas mostra que Desenvolvimento 
        Web não é nehhum bicho de sete cabeças.
      </p>

      <footer>
        <p>
          Preço/hora
          <strong>R$ 200,00</strong>
        </p>
        <button type="button">
          <img src={whatsappIcon} alt="Whatsapp"/>
          Entrar em contato
        </button>
      </footer>
    </article>
  );
}

export default TeacherItem;