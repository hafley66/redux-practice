module.exports = ( filename ) => {
    if ( filename ) {
        return {
            global: {
                module: {
                    rules: [
                        {
                            test:    /\.(ttf|eot|woff)$/,
                            loader:  'file-loader',
                            options: {
                                name: filename
                            }
                        },
                        {
                            test:    /\.(png|jpg|jpeg|svg|gif)$/,
                            loader:  'url-loader',
                            options: {
                                name:  filename,
                                limit: 8192 // inline base64 URLs for <=8k images, direct URLs for the rest
                            }
                        }
                    ]
                }
            }
        };
    }
};
