# Braun-game

Prosta gra w stylu pixelart, w której postać biega i gasi świeczki za pomocą gaśnicy.

## Instrukcja

1. Sterowanie:
   - Strzałki lewo/prawo: poruszanie się
   - Strzałka w górę: skok
   - Spacja: użycie gaśnicy

2. Cel gry:
   - Zgaś wszystkie świeczki (8) na planszy

## Instalacja i uruchomienie

1. Sklonuj repozytorium:
   ```
   git clone https://github.com/Springman1/Braun-game.git
   ```

2. Otwórz plik `index.html` w przeglądarce lub użyj lokalnego serwera:
   ```
   npx http-server
   ```

## Technologia

- Phaser 3 - framework do tworzenia gier HTML5
- JavaScript
- HTML5 Canvas
- CSS3

## Hosting na własnej domenie

Aby umieścić grę na domenie grzegorz-braun.pl:

1. Upewnij się, że masz dostęp do panelu administracyjnego domeny
2. Załaduj wszystkie pliki do katalogu głównego serwera WWW
3. Upewnij się, że serwer ma poprawnie skonfigurowane nagłówki MIME dla plików JavaScript i obrazów

## Rozwój projektu

Aby rozwijać projekt:

1. Dodaj własne grafiki w folderze `assets/`
2. Dostosuj mechanikę gry w pliku `js/game.js`
3. Zmodyfikuj wygląd w pliku `css/style.css`

## Uwaga

Przed uruchomieniem projektu w wersji produkcyjnej należy dodać własne grafiki do folderu `assets/`.