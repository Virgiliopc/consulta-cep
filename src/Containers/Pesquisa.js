import { useState, useEffect } from "react";
import consultarCep from 'cep-promise';
import CEPDados from "../Components/CEPDados";

function numbersOnly(str) {
  return str.replace(/[^\d]/g, '')
}
function translate(cepDados){
  return {
    "ESTADO": cepDados.state,
    "CIDADE": cepDados.city,
    "BAIRRO": cepDados.neighborhood,
    "LOGRADOURO": cepDados.street
  }  
}
function Pesquisa(props) {
  const goTo = props.goTo;
  const ticket = props.ticket;
  const setErrorMessage = props.setErrorMessage;
  const setResultado = props.setResultado;
  const [cepNumber, setCepNumber] = useState("");
  const [cepFavorito, setCepFavorito] = useState("");
  const [cepDados, setCepDados] = useState({});

  useEffect(() => {
    const storedCep = localStorage.getItem("cepFavorito") || "";
    setCepFavorito(storedCep);
  }, []);

  useEffect(() => {
    if (!cepFavorito) {
      return;
    }
    localStorage.setItem("cepFavorito", cepFavorito);
    consultarCep(cepFavorito)
      .then(resultado => setCepDados(resultado))
      .catch(err => setCepDados({ "ERRO": err.message }))
  }, [cepFavorito]);

  function handleChange(evt) {
    const value = evt.target.value;
    setCepNumber(numbersOnly(value));
  }
  function clear() {
    setCepNumber("");
  }
  function handleSucess(cepDados) {
    const resultado = translate(cepDados);
    setResultado(resultado);
    goTo("RESULTADOS");
  }
  function handleError(err) {
    const errorMessage = err.message;
    setErrorMessage(errorMessage);
    goTo("ERRO");
  }
  function handleSeach() {
    ticket.current++;
    const currentTicket = ticket.current;
    goTo("CARREGANDO");
    consultarCep(cepNumber)
      .then(result => currentTicket == ticket.current && handleSucess(result))
      .catch(err => currentTicket == ticket.current && handleError(err))
  }
  function handleAdicionarFavorito() {
    setCepFavorito(cepNumber);
  }
  return <>
    <p>Qual CEP você deseja pesquisar?</p>
    <input value={numbersOnly(cepNumber)} onChange={handleChange}/>
    <button onClick={handleSeach}>CONSULTAR</button>
    <button onClick={handleAdicionarFavorito}>SALVAR FAVORITO</button>
    <pr />
    <p>Favorito: {cepFavorito} </p>
    <CEPDados cepDados={translate(cepDados)}/>
  </>
}

export default Pesquisa;