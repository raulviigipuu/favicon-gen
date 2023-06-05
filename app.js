import { createCanvas } from 'canvas';
import GIFEncoder from 'gifencoder';
import fs from 'fs';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const animationFiles = fs.readdirSync(`${__dirname}/animations`);
const animations = animationFiles.map(file => file.replace('.js', ''));

inquirer
    .prompt([
        {
            type: 'list',
            name: 'animation',
            message: 'Which animation strategy do you want to use?',
            choices: animations,
        },
        {
            type: 'input',
            name: 'filename',
            message: 'What should be the output file name?',
            default: 'favicon.gif',
        },
        {
            type: 'number',
            name: 'speed',
            message: 'What should be the animation speed (in milliseconds per frame)?',
            default: 500,
            validate: (value) => {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
        },
    ])
    .then(answers => {
        const { animation, filename, speed } = answers;
        createFavicon(animation, filename, speed);
    });


function createFavicon(animationName, filename, speed) {
    const output = fs.createWriteStream(filename);
    const encoder = new GIFEncoder(32, 32);
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    import(`./animations/${animationName}.js`)
        .then((animation) => {
            encoder.createReadStream().pipe(output);

            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(speed);

            for (let i = 0; i < 32; i++) {
                animation.default(ctx, i, canvas);
                encoder.addFrame(ctx);
            }

            encoder.finish();
        })
        .catch((error) => {
            console.error(`Error importing animation ${animationName}: `, error);
        });
}
