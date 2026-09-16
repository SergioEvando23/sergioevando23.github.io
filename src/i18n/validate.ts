interface ValidationIssue {
  path: string;
  message: string;
}

function getKind(value: unknown) {
  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
}

function formatPath(path: string) {
  return path || '<root>';
}

function validateValue(
  source: unknown,
  target: unknown,
  path: string,
  issues: ValidationIssue[],
) {
  const sourceKind = getKind(source);
  const targetKind = getKind(target);

  if (sourceKind !== targetKind) {
    issues.push({
      path: formatPath(path),
      message: `Tipos incompativeis: ${sourceKind} e ${targetKind}`,
    });
    return;
  }

  if (typeof source === 'string' && source.trim().length === 0) {
    issues.push({
      path: formatPath(path),
      message: 'Traducao vazia no idioma de origem',
    });
  }

  if (typeof target === 'string' && target.trim().length === 0) {
    issues.push({
      path: formatPath(path),
      message: 'Traducao vazia no idioma comparado',
    });
  }

  if (typeof source === 'function' && typeof target === 'function') {
    if (source.length !== target.length) {
      issues.push({
        path: formatPath(path),
        message: `Funcoes com quantidade diferente de parametros: ${source.length} e ${target.length}`,
      });
    }

    return;
  }

  if (Array.isArray(source) && Array.isArray(target)) {
    if (source.length !== target.length) {
      issues.push({
        path: formatPath(path),
        message: `Arrays com tamanhos diferentes: ${source.length} e ${target.length}`,
      });
      return;
    }

    source.forEach((item, index) => {
      validateValue(item, target[index], `${path}[${index}]`, issues);
    });
    return;
  }

  if (
    source &&
    target &&
    typeof source === 'object' &&
    typeof target === 'object' &&
    !Array.isArray(source) &&
    !Array.isArray(target)
  ) {
    const sourceEntries = Object.entries(source);
    const targetRecord = target as Record<string, unknown>;

    sourceEntries.forEach(([key, value]) => {
      if (!(key in targetRecord)) {
        issues.push({
          path: formatPath(path ? `${path}.${key}` : key),
          message: 'Chave ausente no idioma comparado',
        });
        return;
      }

      validateValue(value, targetRecord[key], path ? `${path}.${key}` : key, issues);
    });
  }
}

export function validateDictionaryParity(
  portugues: unknown,
  ingles: unknown,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  validateValue(portugues, ingles, '', issues);
  validateValue(ingles, portugues, '', issues);

  return issues;
}
