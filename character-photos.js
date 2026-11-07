/* Owner-managed portraits for the photo game only.
   Put files in assets/images/minigames/character-portraits/ and replace null with a relative path:
   leon: 'assets/images/minigames/character-portraits/leon.webp',
   Paths are relative to photo.html (not this JS file).
   null keeps the existing demo portrait from game-data.js.
   Character IDs, clues and gallery images do not need to change. */
window.RE_CHARACTER_PHOTOS = {
    leon: 'assets/images/minigames/character-portraits/leon.jpg',
    jill: 'assets/images/minigames/character-portraits/jill.jpg',
    claire: 'assets/images/minigames/character-portraits/claire.jpg',
    chris: 'assets/images/minigames/character-portraits/chris.jpg',
    ada: 'assets/images/minigames/character-portraits/ada.jpg',
    wesker: 'assets/images/minigames/character-portraits/wesker.jpg',
    rebecca: 'assets/images/minigames/character-portraits/rebecca.jpg',
    billy: 'assets/images/minigames/character-portraits/billy.jpg',
    barry: 'assets/images/minigames/character-portraits/barry.jpg',
    sherry: 'assets/images/minigames/character-portraits/sherry.jpg',
    jake: 'assets/images/minigames/character-portraits/jake.jpg',
    piers: 'assets/images/minigames/character-portraits/piers.jpg',
    ethan: 'assets/images/minigames/character-portraits/ethan.jpg',
    mia: 'assets/images/minigames/character-portraits/mia.jpg',
    jack: 'assets/images/minigames/character-portraits/jack.jpg',
    lucas: 'assets/images/minigames/character-portraits/lucas.jpg',
    dimitrescu: 'assets/images/minigames/character-portraits/dimitrescu.jpg',
    heisenberg: 'assets/images/minigames/character-portraits/heisenberg.jpg',
    donna: 'assets/images/minigames/character-portraits/donna.jpg',
    hunk: 'assets/images/minigames/character-portraits/hunk.jpg',
    luis: 'assets/images/minigames/character-portraits/luis.jpg',
    krauser: 'assets/images/minigames/character-portraits/krauser.jpg'
};

// Extra identities for the photo game. The 20 text dossiers stay independent.
window.RE_PHOTO_CHARACTERS = [
    {
        id: 'luis', name: 'Luis Serra', image: 'assets/images/minigames/character-portraits/luis.jpg',
        explanation: {
            en: 'Luis Serra from Resident Evil 4. His long dark hair and patterned leather jacket are recognizable features.',
            ru: 'Луис Серра из Resident Evil 4. Его можно узнать по длинным тёмным волосам и узорчатой кожаной куртке.'
        }
    },
    {
        id: 'krauser', name: 'Jack Krauser', image: 'assets/images/minigames/character-portraits/krauser.jpg',
        explanation: {
            en: 'Jack Krauser from Resident Evil 4. His red beret and facial scars are recognizable features.',
            ru: 'Джек Краузер из Resident Evil 4. Красный берет и шрамы на лице — его узнаваемые черты.'
        }
    }
];
