module.exports = ({'meta.constants.filenames': {file}}) => (
    {
        config: {module: {rules: [
            {
                test: /\.(ttf|eot|woff)$/,
                loader: 'file-loader',
                options: {
                    name: file()
                }
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                loader: 'url-loader',
                options: {
                    name: file(),
                    limit: 8192 // inline base64 URLs for <=8k images, direct URLs for the rest
                }
            }
        ]}}
    }
);
