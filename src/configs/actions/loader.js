import yaml from 'js-yaml';
import fs from 'fs';

const requireYaml = file => (yaml.load(fs.readFileSync(file)));

class UnknownConfigExtension extends Error {
    static throw(given) {
        throw new UnknownConfigExtension(`Was given:[${given}] but expected a file of type js/json/yaml`);
    }
}

export default function Loader(path) {


    if(path){
        return (
            path.match(/\.js(on)?$/)
                ? require(path)
                : path.match(/\.ya?ml/)
                    ? requireYaml(path)
                    : UnknownConfigExtension.throw(path)
        );
    }
}
