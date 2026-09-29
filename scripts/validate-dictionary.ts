import { dictionary } from '../src/i18n/dictionary';
import { validateDictionaryParity } from '../src/i18n/validate';

const issues = validateDictionaryParity(dictionary.portuguese, dictionary.english);

if (issues.length > 0) {
  console.error('Falha na validacao do dictionary:');
  issues.forEach((issue) => {
    console.error(`- ${issue.path}: ${issue.message}`);
  });
  process.exit(1);
}

console.log('Dicionario valido: portugues e ingles possuem paridade estrutural.');
