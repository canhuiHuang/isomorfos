import { Types } from 'phaser';

import { Nodes } from './scenes/nodes';

const gameConfig: Types.Core.GameConfig = {
  width: '100%',
  height: '100%',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  scene: [Nodes],
};

export default gameConfig;
