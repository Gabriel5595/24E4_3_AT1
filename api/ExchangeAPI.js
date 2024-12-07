const BASE_URL = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

const formatarDataParaAPI = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}-${mes}-${ano}`;
};

const ExchangeAPI = {
    async obterListaDeMoedas() {
        try {
            const response = await fetch(`${BASE_URL}/Moedas?$top=100&$format=json`);
            if (!response.ok) {
                const errorMessage = `Erro na API (${response.status}): ${response.statusText}`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log(data.value)
            return data.value.map((moeda) => ({
                simbolo: moeda.simbolo,
                nomeFormatado: moeda.nomeFormatado,
                tipoMoeda: moeda.tipoMoeda,
            }));
        } catch (error) {
            console.error('Erro ao obter a lista de moedas:', error);
            throw new Error('Não foi possível obter a lista de moedas.');
        }
    },

    async obterCotacaoPorData(simboloMoeda, data) {
        try {
            const dataFormatada = formatarDataParaAPI(data);
            const url = `${BASE_URL}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda=%27${simboloMoeda}%27&@dataCotacao=%27${dataFormatada}%27&$top=1&$format=json`;
            console.log(url)
            const response = await fetch(url);
            if (!response.ok) {
                const errorMessage = `Erro na API (${response.status}): ${response.statusText}`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            const dataResponse = await response.json();
            const cotacao = dataResponse.value[0];

            if (!cotacao) {
                throw new Error(`Nenhuma cotação encontrada para a moeda ${simboloMoeda} na data ${dataFormatada}.`);
            }

            return {
                simbolo: simboloMoeda,
                cotacaoCompra: cotacao.cotacaoCompra,
                cotacaoVenda: cotacao.cotacaoVenda,
                dataHoraCotacao: cotacao.dataHoraCotacao,
            };
        } catch (error) {
            console.error('Erro ao obter a cotação:', error);
            throw new Error('Não foi possível obter a cotação para a moeda informada.');
        }
    },
};

export default ExchangeAPI;
