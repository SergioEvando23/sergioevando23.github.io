import { dicionario } from '../src/i18n/dicionario';
import { validateDictionaryParity } from '../src/i18n/validate';

const issues = validateDictionaryParity(dicionario.portugues, dicionario.ingles);

if (issues.length > 0) {
  console.error('Falha na validacao do dicionario:');
  issues.forEach((issue) => {
    console.error(`- ${issue.path}: ${issue.message}`);
  });
  process.exit(1);
}

console.log('Dicionario valido: portugues e ingles possuem paridade estrutural.');
