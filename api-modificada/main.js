// não altere!
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');
const sql = require('mssql');

// não altere!
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// configure a linha abaixo caso queira que os dados capturados sejam inseridos no banco de dados.
// false -> nao insere
// true -> insere
const HABILITAR_OPERACAO_INSERIR = true;

// altere o valor da variável AMBIENTE para o valor desejado:
// API conectada ao banco de dados remoto, SQL Server -> 'producao'
// API conectada ao banco de dados local, MySQL Workbench - 'desenvolvimento'
const AMBIENTE = 'desenvolvimento';

const serial = async (
    valoresSteeping,
    valoresMalting1,
    valoresMalting2,
    valoresMalting3,
    valoresMilling,
    valoresMashing1,
    valoresMashing2,
    valoresMashing3,
    valoresBrewing,
    valoresCooling1,
    valoresCooling2,
    valoresCooling3,
    valoresMaturation,
    valoresPackaging,
    valoresFinalProduct
) => {
    let poolBancoDados = ''

    if (AMBIENTE == 'desenvolvimento') {
        poolBancoDados = mysql.createPool(
            {
                // altere!
                // CREDENCIAIS DO BANCO LOCAL - MYSQL WORKBENCH
                host: 'localhost',
                user: 'usuarioCervejaria',
                password: 'sptech',
                database: 'cervejaLager'
            }
        ).promise();
    } else if (AMBIENTE == 'producao') {
        console.log('Projeto rodando inserindo dados em nuvem. Configure as credenciais abaixo.');
    } else {
        throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
    }


    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        console.log(data);
        const valores = data.split(';');
        const steeping = parseFloat(valores[0]);
        const malting1 = parseFloat(valores[1]);
        const malting2 = parseFloat(valores[2]);
        const malting3 = parseFloat(valores[3]);
        const milling = parseFloat(valores[4]);
        const mashing1 = parseFloat(valores[5]);
        const mashing2 = parseFloat(valores[6]);
        const mashing3 = parseFloat(valores[7]);
        const brewing = parseFloat(valores[8]);
        const cooling1 = parseFloat(valores[9]);
        const cooling2 = parseFloat(valores[10]);
        const cooling3 = parseFloat(valores[11]);
        const maturation = parseFloat(valores[12]);
        const packaging = parseFloat(valores[13]);
        const finalProduct = parseFloat(valores[14]);

        valoresSteeping.push(steeping);
        valoresMalting1.push(malting1);
        valoresMalting2.push(malting2);
        valoresMalting3.push(malting3);
        valoresMilling.push(milling);
        valoresMashing1.push(mashing1);
        valoresMashing2.push(mashing2);
        valoresMashing3.push(mashing3);
        valoresBrewing.push(brewing);
        valoresCooling1.push(cooling1);
        valoresCooling2.push(cooling2);
        valoresCooling3.push(cooling3);
        valoresMaturation.push(maturation);
        valoresPackaging.push(packaging);
        valoresFinalProduct.push(finalProduct);

        if (HABILITAR_OPERACAO_INSERIR) {
            if (AMBIENTE == 'producao') {
                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> Importante! você deve ter o aquario de id 1 cadastrado.
                sqlquery = `INSERT INTO medida (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave, momento, fk_aquario) VALUES (${dht11Umidade}, ${dht11Temperatura}, ${luminosidade}, ${lm35Temperatura}, ${chave}, CURRENT_TIMESTAMP, 1)`;

                // CREDENCIAIS DO BANCO REMOTO - SQL SERVER
                // Importante! você deve ter criado o usuário abaixo com os comandos presentes no arquivo
                // "script-criacao-usuario-sqlserver.sql", presente neste diretório.
                const connStr = "Server=servidor-acquatec.database.windows.net;Database=bd-acquatec;User Id=usuarioParaAPIArduino_datawriter;Password=#Gf_senhaParaAPI;";

                function inserirComando(conn, sqlquery) {
                    conn.query(sqlquery);
                    console.log("valores inseridos no banco: ", dht11Umidade + ", " + dht11Temperatura + ", " + luminosidade + ", " + lm35Temperatura + ", " + chave)
                }

                sql.connect(connStr)
                    .then(conn => inserirComando(conn, sqlquery))
                    .catch(err => console.log("erro! " + err));

            } else if (AMBIENTE == 'desenvolvimento') {

                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> você deve ter o aquario de id 1 cadastrado.
                await poolBancoDados.execute(
                    `INSERT INTO lager (steeping, malting_1, malting_2, malting_3, milling, mashing_1, mashing_2, mashing_3, brewing, cooling_1, cooling_2, cooling_3, maturation_filtration, flash_pasteurization_packaging, final_product) VALUES (${steeping}, ${malting1}, ${malting2}, ${malting3}, ${milling}, ${mashing1}, ${mashing2}, ${mashing3}, ${brewing}, ${cooling1}, ${cooling2}, ${cooling3}, ${maturation}, ${packaging}, ${finalProduct})`,
                    
                );
                console.log("valores inseridos no banco! ")

            } else {
                throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
            }
        }
    });
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

(async () => {
    const valoresSteeping = [];
    const valoresMalting1 = [];
    const valoresMalting2 = [];
    const valoresMalting3 = [];
    const valoresMilling = [];
    const valoresMashing1 = [];
    const valoresMashing2 = [];
    const valoresMashing3 = [];
    const valoresBrewing = [];
    const valoresCooling1 = [];
    const valoresCooling2 = [];
    const valoresCooling3 = [];
    const valoresMaturation = [];
    const valoresPackaging = [];
    const valoresFinalProduct = [];
    await serial(
        valoresSteeping,
        valoresMalting1,
        valoresMalting2,
        valoresMalting3,
        valoresMilling,
        valoresMashing1,
        valoresMashing2,
        valoresMashing3,
        valoresBrewing,
        valoresCooling1,
        valoresCooling2,
        valoresCooling3,
        valoresMaturation,
        valoresPackaging,
        valoresFinalProduct
    );
})();