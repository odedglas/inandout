const avatarPalette = {
  colors: [
    'red',
    'pink',
    'purple',
    'deeppurple',
    'indigo',
    'blue',
    'lightblue',
    'cynan',
    'teal',
    'green',
    'lightgreen',
    'lime',
    'yellow',
    'amber',
    'orage',
    'deeporange',
    'brown',
    'grey',
    'bluegrey'
  ],
  // Red, Pink, Purple, Deep Purple, Indigo, Blue, Light Blue, Cyan, Teal, Green, Light Green, Lime, Yellow, Amber,
  // Orange, Deep Orange, Brown, Grey, Blue Grey
  '200': [
    '#EF9A9A',
    '#F48FB1',
    '#CE93D8',
    '#B39DDB',
    '#9FA8DA',
    '#90CAF9',
    '#81D4FA',
    '#80DEEA',
    '#80CBC4',
    '#A5D6A7',
    '#C5E1A5',
    '#E6EE9C',
    '#FFF59D',
    '#FFE082',
    '#FFCC80',
    '#FFAB91',
    '#BCAAA4',
    '#EEEEEE',
    '#B0BEC5'
  ],
  '300': [
    '#E57373',
    '#F06292',
    '#BA68C8',
    '#9575CD',
    '#7986CB',
    '#64B5F6',
    '#4FC3F7',
    '#4DD0E1',
    '#4DB6AC',
    '#81C784',
    '#AED581',
    '#DCE775',
    '#FFF176',
    '#FFD54F',
    '#FFB74D',
    '#FF8A65',
    '#A1887F',
    '#E0E0E0',
    '#90A4AE'
  ],
  '400': [
    '#EF5350',
    '#EC407A',
    '#AB47BC',
    '#7E57C2',
    '#5C6BC0',
    '#42A5F5',
    '#29B6F6',
    '#26C6DA',
    '#26A69A',
    '#66BB6A',
    '#9CCC65',
    '#D4E157',
    '#FFEE58',
    '#FFCA28',
    '#FFA726',
    '#FF7043',
    '#8D6E63',
    '#BDBDBD',
    '#78909C'
  ],
  '500': [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B'
  ],
  '600': [
    '#E53935',
    '#D81B60',
    '#8E24AA',
    '#5E35B1',
    '#3949AB',
    '#1E88E5',
    '#039BE5',
    '#00ACC1',
    '#00897B',
    '#43A047',
    '#7CB342',
    '#C0CA33',
    '#FDD835',
    '#FFB300',
    '#FB8C00',
    '#F4511E',
    '#6D4C41',
    '#757575',
    '#546E7A'
  ],
  '700': [
    '#D32F2F',
    '#C2185B',
    '#7B1FA2',
    '#512DA8',
    '#303F9F',
    '#1976D2',
    '#0288D1',
    '#0097A7',
    '#00796B',
    '#388E3C',
    '#689F38',
    '#AFB42B',
    '#FBC02D',
    '#FFA000',
    '#F57C00',
    '#E64A19',
    '#5D4037',
    '#616161',
    '#455A64'
  ],
  '800': [
    '#C62828',
    '#AD1457',
    '#6A1B9A',
    '#4527A0',
    '#283593',
    '#1565C0',
    '#0277BD',
    '#00838F',
    '#00695C',
    '#2E7D32',
    '#558B2F',
    '#9E9D24',
    '#F9A825',
    '#FF8F00',
    '#EF6C00',
    '#D84315',
    '#4E342E',
    '#424242',
    '#37474F'
  ],
  '900': [
    '#B71C1C',
    '#880E4F',
    '#4A148C',
    '#311B92',
    '#1A237E',
    '#0D47A1',
    '#01579B',
    '#006064',
    '#004D40',
    '#1B5E20',
    '#33691E',
    '#827717',
    '#F57F17',
    '#FF6F00',
    '#E65100',
    '#BF360C',
    '#3E2723',
    '#212121',
    '#263238'
  ],
  'A100': [
    '#FF8A80',
    '#FF80AB',
    '#EA80FC',
    '#B388FF',
    '#8C9EFF',
    '#82B1FF',
    '#80D8FF',
    '#84FFFF',
    '#A7FFEB',
    '#B9F6CA',
    '#CCFF90',
    '#F4FF81',
    '#FFFF8D',
    '#FFE57F',
    '#FFD180',
    '#FF9E80'
  ],
  'A200': [
    '#FF5252',
    '#FF4081',
    '#E040FB',
    '#7C4DFF',
    '#536DFE',
    '#448AFF',
    '#40C4FF',
    '#18FFFF',
    '#64FFDA',
    '#69F0AE',
    '#B2FF59',
    '#EEFF41',
    '#FFFF00',
    '#FFD740',
    '#FFAB40',
    '#FF6E40'
  ],
  'A400': [
    '#FF1744',
    '#F50057',
    '#D500F9',
    '#651FFF',
    '#3D5AFE',
    '#2979FF',
    '#00B0FF',
    '#00E5FF',
    '#1DE9B6',
    '#00E676',
    '#76FF03',
    '#C6FF00',
    '#FFEA00',
    '#FFC400',
    '#FF9100',
    '#FF3D00'
  ],
  'A700': [
    '#D50000',
    '#C51162',
    '#AA00FF',
    '#6200EA',
    '#304FFE',
    '#2962FF',
    '#0091EA',
    '#00B8D4',
    '#00BFA5',
    '#00C853',
    '#64DD17',
    '#AEEA00',
    '#FFD600',
    '#FFAB00',
    '#FF6D00',
    '#DD2C00'
  ]
};

export default {
  config: {
    /*    typography: {
          // Use the system font instead of the default Roboto font.
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },*/
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: {
        main: '#376a7f',
      },
      secondary: {
        main: '#37474f',
      },
    },
  },
  getAvatarRandomColor: (shade) => {

    if (!shade) {

      //Setting ranged shade
      const paletteShades = Object.keys(avatarPalette);
      shade = paletteShades[getRandomInt(paletteShades.length)];
    }

    //Now that we ensured shade exists;
    const selectedShade = avatarPalette[shade];
    return selectedShade[getRandomInt(selectedShade.length)]

  },

  getColor: (color, shade) => {

    shade = shade ? shade : 500;
    const pallete = avatarPalette[shade];

    const normalizedColor = color.toLowerCase().replaceAll(" ", "");
    return pallete[avatarPalette.colors.indexOf(normalizedColor)];
  },

  getPalette: (shade) => avatarPalette[shade],
  withOpacity: (color, opacity) => {

    let c = color.substring(1).split('');
    if (c.length === 3) {
      c = [
        c[0],
        c[0],
        c[1],
        c[1],
        c[2],
        c[2]
      ];
    }
    c = '0x' + c.join('');
    return `rgba(${[
      (c >> 16) & 255,
      (c >> 8) & 255,
      c & 255
    ].join(',')}, ${opacity || 1})`;
  }
}

const getRandomInt = (max) => Math.floor(Math.random() * (max));