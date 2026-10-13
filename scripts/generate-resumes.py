from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer


OUTPUT_DIR = Path('public/documents')


def build_resume(filename: str, content: dict[str, object]) -> None:
    styles = getSampleStyleSheet()
    title = ParagraphStyle('ResumeTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=23, leading=27, textColor=colors.HexColor('#111827'), spaceAfter=3)
    contact = ParagraphStyle('Contact', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=13, textColor=colors.HexColor('#4B5563'), spaceAfter=14)
    heading = ParagraphStyle('Heading', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=colors.HexColor('#0F766E'), spaceBefore=10, spaceAfter=4)
    body = ParagraphStyle('Body', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.4, leading=14, textColor=colors.HexColor('#1F2937'), spaceAfter=4)
    job = ParagraphStyle('Job', parent=body, fontName='Helvetica-Bold', spaceBefore=2, spaceAfter=1)
    metadata = ParagraphStyle('Metadata', parent=body, fontName='Helvetica-Oblique', textColor=colors.HexColor('#4B5563'), spaceAfter=4)
    bullet = ParagraphStyle('Bullet', parent=body, leftIndent=12, firstLineIndent=-8, spaceAfter=2)

    document = SimpleDocTemplate(
        str(OUTPUT_DIR / filename), pagesize=A4, rightMargin=1.65 * cm, leftMargin=1.65 * cm,
        topMargin=1.35 * cm, bottomMargin=1.35 * cm,
        title=content['title'], author='Sérgio Costa',
    )
    story = [
        Paragraph('Sérgio Costa', title),
        Paragraph('workbysergiocosta@gmail.com &nbsp;|&nbsp; linkedin.com/in/sergiocosta23 &nbsp;|&nbsp; github.com/sergioevando23', contact),
        HRFlowable(width='100%', thickness=0.7, color=colors.HexColor('#CBD5E1')),
        Paragraph(content['summary_title'], heading),
    ]
    story.extend(Paragraph(item, body) for item in content['summary'])
    story.extend([
        Paragraph(content['experience_title'], heading),
        Paragraph('XP Inc. — ' + content['xp_role'], job),
        Paragraph(content['xp_period'] + ' &nbsp;|&nbsp; Brasil', metadata),
    ])
    story.extend(Paragraph('• ' + item, bullet) for item in content['xp_bullets'])
    story.extend([
        Spacer(1, 4),
        Paragraph('Eduardo Costa Software Solutions — ' + content['previous_role'], job),
        Paragraph(content['previous_period'] + ' &nbsp;|&nbsp; Brasil', metadata),
    ])
    story.extend(Paragraph('• ' + item, bullet) for item in content['previous_bullets'])
    story.extend([
        Paragraph(content['education_title'], heading),
        Paragraph(content['education'], body),
        Paragraph(content['certification_title'], heading),
        *[Paragraph(certification, body) for certification in content['certifications']],
        Paragraph(content['skills_title'], heading),
    ])
    story.extend(Paragraph(item, body) for item in content['skills'])
    document.build(story)


build_resume('SergioCostaResume.pdf', {
    'title': 'Sérgio Costa Resume',
    'summary_title': 'Summary',
    'summary': [
        'Software Engineer focused on frontend development, with experience building web and mobile applications in high-scale environments.',
        'Specialized in React and TypeScript, with experience designing scalable architectures such as micro-frontends, focused on performance, maintainability, and long-term evolution.',
        'Strong background in automated testing, code quality, REST and GraphQL APIs, Flutter, and engineering best practices.',
    ],
    'experience_title': 'Experience',
    'xp_role': 'Fullstack Web & Mobile Software Engineer',
    'xp_period': 'Sep. 2022 — Oct. 2026',
    'xp_bullets': [
        'Developed scalable web applications with React and TypeScript, as well as mobile applications with Flutter.',
        'Contributed to architectural decisions, including monolith-to-microfrontend migrations.',
        'Implemented CI/CD pipelines and automated unit and E2E tests.',
        'Responded to production incidents and helped improve application stability.',
    ],
    'previous_role': 'Software Developer',
    'previous_period': 'Feb. 2021 — Jul. 2021',
    'previous_bullets': [
        'Developed frontend applications with React and TypeScript and integrated them with REST APIs.',
        'Built reusable components and improved code structure, performance, and user experience.',
    ],
    'education_title': 'Education',
    'education': 'Bachelor’s Degree in Software Engineering — Estácio (2025 — 2029)',
    'certification_title': 'Certifications',
    'certifications': [
        'Prompt Engineering with AI: From Zero to Advanced — Udemy (issued Sep. 2026) | Credential ID: UC-783d4a69-045e-45f0-b7d3-644e776f9edd',
        'Artificial Intelligence: From Zero to Advanced — Udemy (issued Sep. 2026) | Credential ID: UC-77eff13e-22d0-48e3-a734-f4f44348c5af',
        'Security Champions - Secure application — Gopliance (issued Oct. 2025)',
    ],
    'skills_title': 'Technical Skills',
    'skills': [
        '<b>Frontend:</b> React.js, TypeScript, JavaScript, HTML5, CSS3, Styled Components',
        '<b>Architecture:</b> Micro-frontends, Clean Architecture, SOLID, Design Patterns',
        '<b>Testing:</b> Jest, React Testing Library, Playwright, Cucumber, Robot Framework',
        '<b>Mobile &amp; Other:</b> Flutter, Dart, REST APIs, GraphQL, Firebase, Dynatrace',
    ],
})

build_resume('CurriculoSergioCosta.pdf', {
    'title': 'Currículo Sérgio Costa',
    'summary_title': 'Resumo',
    'summary': [
        'Engenheiro de Software com foco em desenvolvimento frontend, com experiência na construção de aplicações web e mobile em ambientes de alta escala.',
        'Especializado em React e TypeScript, com experiência na definição de arquiteturas escaláveis como micro-frontends, priorizando performance, manutenibilidade e evolução contínua.',
        'Experiência com testes automatizados, qualidade de código, APIs REST e GraphQL, Flutter e boas práticas de engenharia.',
    ],
    'experience_title': 'Experiência',
    'xp_role': 'Engenheiro de Software Fullstack Web & Mobile',
    'xp_period': 'Set. 2022 — Out. 2026',
    'xp_bullets': [
        'Desenvolvimento de aplicações web escaláveis com React e TypeScript, além de aplicações mobile com Flutter.',
        'Participação em decisões de arquitetura, incluindo migrações de monólito para micro-frontends.',
        'Implementação de pipelines de CI/CD e testes automatizados unitários e E2E.',
        'Atuação na resposta a incidentes em produção e na melhoria da estabilidade das aplicações.',
    ],
    'previous_role': 'Desenvolvedor de Software',
    'previous_period': 'Fev. 2021 — Jul. 2021',
    'previous_bullets': [
        'Desenvolvimento de aplicações frontend com React e TypeScript e integração com APIs REST.',
        'Criação de componentes reutilizáveis e melhorias na estrutura do código, performance e experiência do usuário.',
    ],
    'education_title': 'Formação Acadêmica',
    'education': 'Bacharelado em Engenharia de Software — Estácio (2025 — 2029)',
    'certification_title': 'Certificados',
    'certifications': [
        'Engenharia de Prompts com IA: Do Zero ao Avançado — Udemy (emitido em set. de 2026) | Código da credencial: UC-783d4a69-045e-45f0-b7d3-644e776f9edd',
        'Inteligência artificial do zero ao avançado — Udemy (emitido em set. de 2026) | Código da credencial: UC-77eff13e-22d0-48e3-a734-f4f44348c5af',
        'Security Champions - Aplicação segura — Gopliance (emitido em out. de 2025)',
    ],
    'skills_title': 'Habilidades Técnicas',
    'skills': [
        '<b>Frontend:</b> React.js, TypeScript, JavaScript, HTML5, CSS3, Styled Components',
        '<b>Arquitetura:</b> Micro-frontends, Clean Architecture, SOLID, Design Patterns',
        '<b>Testes:</b> Jest, React Testing Library, Playwright, Cucumber, Robot Framework',
        '<b>Mobile e outros:</b> Flutter, Dart, APIs REST, GraphQL, Firebase, Dynatrace',
    ],
})
