const translations = {
  pt: {
    'hero.cta': 'Ver projetos',
    'hero.image_alt': 'Thayná na Shibuya Crossing',
    'about.text': `Comecei pelo código e me apaixonei pelo design. Há cinco anos
              entrei no desenvolvimento fullstack — e logo percebi que o
              frontend era onde eu queria estar. Em 2024 adicionei UX/UI à
              mistura, não como uma virada de carreira, mas como a peça que
              faltava. Descobri que gosto tanto de entender por que algo precisa
              ser feito quanto de fazer. Me atrai estética com ponto de vista —
              Bauhaus, Brutalismo, Blueprint, Futurismo. Coisas que parecem
              intencionais porque são. Quando não estou no Figma ou no VSCode,
              provavelmente estou planejando a próxima viagem ou no meio de um
              capítulo de manga.`,
    'project1.sub': 'Criado a partir da necessidade de organizar minha própria viagem, o My Trip Buddy rapidamente evoluiu para muito além da ideia inicial. O aplicativo reúne destinos, hotéis, voos, itinerários, orçamento, documentos e até o planejamento dos looks para cada dia das férias, centralizando tudo em uma única experiência. O projeto foi concebido para reduzir a complexidade do planejamento e oferecer ao viajante uma forma prática e agradável de visualizar toda a viagem. Para complementar essa experiência, a interface adota uma identidade inspirada no neobrutalismo, combinando um visual marcante com uma navegação intuitiva e organizada.',
    'project2.sub': 'O Party Studio é um estúdio criativo impulsionado por IA para quem quer ir além do convite tradicional. Em poucos minutos, você cria convites personalizados com fotos, vídeos e trilha sonora, transformando um simples convite em uma experiência que reflete o estilo da sua festa.',
    'project3.sub': 'Como tornar o gerenciamento de medicamentos mais simples e acessível? O Remedia nasceu dessa pergunta. A partir de pesquisa, ideação, prototipação e testes de usabilidade, desenvolvi uma solução que reduz a complexidade da experiência e prioriza clareza, inclusão e facilidade de uso.',
    'project4.sub': 'Este projeto explora a criação de um ecossistema financeiro integrado, conectando aplicativo móvel, desktop, smartwatch e caixas eletrônicos em uma experiência consistente. Ao longo do processo, desenvolvi wireframes, fluxos de navegação e visualizações de dados financeiros adaptadas a diferentes dispositivos, sempre priorizando clareza, acessibilidade e usabilidade. O resultado é uma experiência coesa, alinhada à identidade visual do Itaú e projetada para tornar o gerenciamento financeiro mais simples, intuitivo e eficiente.',
    'project5.sub': 'Desenvolvido para tornar a busca por benefícios mais simples e conveniente, este aplicativo reúne cupons e ofertas exclusivas de estabelecimentos próximos ao usuário em uma única experiência. O projeto foi pensado para facilitar o acesso a descontos de forma rápida e intuitiva, combinando geolocalização, integração com APIs e uma navegação fluida para conectar pessoas às melhores oportunidades ao seu redor.',
    'project.link': 'Ver site ↗',
    'contact.tag_main': 'Quest principal',
    'contact.available': 'Disponível para novos projetos',
    'footer.copyright': '© 2026 Thayná Müller. Todos os direitos reservados.',
  },
  en: {
    'hero.cta': 'View projects',
    'hero.image_alt': 'Thayná at Shibuya Crossing',
    'about.text': `I started with code and fell in love with design. Five years
              ago I moved into fullstack development — and quickly realized
              frontend was where I wanted to be. In 2024 I added UX/UI to the
              mix, not as a career pivot, but as the missing piece. I found out
              I enjoy understanding why something needs to be done as much as
              actually doing it. I'm drawn to aesthetics with a point of view —
              Bauhaus, Brutalism, Blueprint, Futurism. Things that feel
              intentional because they are. When I'm not in Figma or VSCode,
              I'm probably planning my next trip or in the middle of a manga
              chapter.`,
    'project1.sub': "Born out of the need to organize my own trip, My Trip Buddy quickly grew far beyond its initial idea. The app brings together destinations, hotels, flights, itineraries, budget, documents, and even outfit planning for each day of the trip, centralizing everything into a single experience. It was designed to reduce the complexity of trip planning and give travelers a practical, enjoyable way to visualize the whole journey. To complement that experience, the interface adopts a neobrutalist-inspired identity, pairing a bold visual style with intuitive, organized navigation.",
    'project2.sub': "Party Studio is an AI-powered creative studio for anyone who wants to go beyond the traditional invitation. In just a few minutes, you create personalized invites with photos, videos, and a soundtrack, turning a simple invitation into an experience that reflects your party's style.",
    'project3.sub': 'How can medication management be made simpler and more accessible? Remedia was born from that question. Through research, ideation, prototyping, and usability testing, I developed a solution that reduces the complexity of the experience while prioritizing clarity, inclusion, and ease of use.',
    'project4.sub': "This project explores building an integrated financial ecosystem, connecting mobile app, desktop, smartwatch, and ATMs into one consistent experience. Along the way, I developed wireframes, navigation flows, and financial data visualizations adapted to different devices, always prioritizing clarity, accessibility, and usability. The result is a cohesive experience aligned with Itaú's visual identity, designed to make financial management simpler, more intuitive, and more efficient.",
    'project5.sub': 'Built to make finding deals simpler and more convenient, this app brings together coupons and exclusive offers from nearby businesses into a single experience. It was designed to make accessing discounts fast and intuitive, combining geolocation, API integrations, and smooth navigation to connect people with the best opportunities around them.',
    'project.link': 'Visit site ↗',
    'contact.tag_main': 'Main quest',
    'contact.available': 'Available for new projects',
    'footer.copyright': '© 2026 Thayná Müller. All rights reserved.',
  },
};

function detectLang() {
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function applyLang(lang) {
  const dict = translations[lang];
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n')];
    if (value != null) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = dict[el.getAttribute('data-i18n-alt')];
    if (value != null) el.setAttribute('alt', value);
  });

}

applyLang(detectLang());
