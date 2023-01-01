import CEPDados from "../Components/CEPDados";

function Resultados(props) {
  const result = props.result;
  const goTo = props.goTo;
  
  return <>
    <p>Resultados para o CEP {result.cep}</p>
    <CEPDados cepDados={result}/>
    <button onClick={() => goTo("PESQUISA")}>NOVA CONSULTA</button>
  </>
}

export default Resultados;

