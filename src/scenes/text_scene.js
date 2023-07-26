const api = "https://backroomsbackend.matheusloiola1.repl.co/api/speedrun/"

async function getRanking(map) {
    try {
        const response = await axios.get(api + map);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return []
    }
}


async function postSpeedrun(obj) {
    console.log(obj);
    try {
        const result = await axios.get(api + 'player/' + obj.player);
        result?.data.forEach(item => {
            if (item.map == obj.map) {
                return false;
            }
        });
    }
    catch (error) {
        console.log('error!!!', error);
        return false;;
    }
    console.log('player not found');
    try {
        await axios.post(api, obj);
        return true;
    }
    catch (error) {
        console.log(error);
        return false
    }
}

function autoReload() {
  const reloadTime = 20000;

  // Configura o temporizador para recarregar após o tempo especificado
  setTimeout(() => {
    location.reload(true);
  }, reloadTime);
}

export default class TextScene extends Phaser.Scene {
    constructor() {
        super('TextScene');
        this.text = null;
        this.nextScene = null;
    }

    async create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000);
        this.text = data.text;

        if (!data.timeText) {
            data.timeText = 5000;
        }

        const textConfig = {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: {
                width: 300
            }
        };

        this.textObject = this.add.text(0, 0, '', textConfig);
        this.textObject.setVisible(true);

        // Devemos receber data.playerInfo {name, lastTime, totalTime, map}

        if (data.playerInfo.map != data.nextScene) {
            // Salvar jogador no BD
            const ans = await postSpeedrun({
                player: data.playerInfo.name,
                map: data.playerInfo.map,
                time: data.playerInfo.lastTime
            });
            this.textObject.setText('Seu tempo no mapa foi: ' + data.playerInfo.lastTime.toFixed(2) + ' segundos');

            // Recuperar melhores tempos
            let dados = [];
            const speedrunInfo = await getRanking(data.playerInfo.map);
            for (let i = 0; i < speedrunInfo.length; i++) {
                dados.push({
                    name: speedrunInfo[i].player,
                    time: speedrunInfo[i].time
                });
            }
            dados.sort((a, b) => a.time - b.time);
          
            dados = dados.filter((item, index, array) => {
                return array.findIndex((element) => element.name === item.name) === index;
            });
          
            // Printar dados na tela
            let output = "";
            dados.forEach(item => {output += item.name + " - " + item.time.toFixed(2) + " segundos\n";});
            this.time.delayedCall(4000, () => {
                this.textObject.setText("Placar dos melhores:\n" + output);
            });
            this.time.delayedCall(11000, () => {
                this.textObject.setText(this.text);
            });
            this.waitDelay = 14000;
        }
        else {
            this.add.text(0, 100, this.text, textConfig);
            this.waitDelay = 0;
        }

        if (data.nextScene == 'Frontrooms'){
          autoReload();
        }
        else {
          this.time.delayedCall(this.waitDelay, () => {
              setTimeout(() => {
                  this.cameras.main.fadeOut(2000);
                  this.cameras.main.once('camerafadeoutcomplete', () => {
                      this.nextScene = data.nextScene;
                      this.scene.start(this.nextScene, { playerInfo: data.playerInfo });
                  });
              }, data.timeText);
          });
        }
    }
}