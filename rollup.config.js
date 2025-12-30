import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/playbar.umd.js',
            format: 'umd',
            name: 'Playbar',
            exports: 'named'
        },
        {
            file: 'dist/playbar.esm.js',
            format: 'esm'
        },
        {
            file: 'dist/playbar.cjs.js',
            format: 'cjs',
            exports: 'named'
        }
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: './dist'
        }),
        terser()
    ]
};
