# Clean Code Labs

## Lab 1

### Wzorce konstrukcyjne

#### Singleton

Stworzony w: [./src/lib/console.ts](./src/lib/console.ts)

Nazwa Klasy: `CConsole`

Cel wykorzystania: Wykorzystany jako obiekt loggera aby zapobiec tworzeniu się kolejnych instancji tej samej klasy, gdyż w przypadku takich narzędzi jak logger, nie jest to konieczne.

Przykład wykorzystania: [./src/modules/middleware/log.ts](./src/modules/middleware/log.ts)

#### Builder

Stworzony w: [./src/lib/query.ts](./src/lib/query.ts)

Nazwa Klasy: `PrismaQueryBuilder`

Cel wykorzystania: Wykorzystany wzorzec pozwolił na łatwiejsze tworzenie zapytań dla narzędzia ORM Prisma. Klasa automatycznie buduje części zapytania SQL takie jak `WHERE`, `ORDER BY`, dołączanie tabel, czy wybór odpowiednich kolumn.

Przykład wykorzystania: [./src/app/api/admin/users/route.ts](./src/app/api/admin/users/route.ts)

#### Abstract Factory

Stworzony w: [./src/lib/axios/parser/index.ts](./src/lib/axios/parser/index.ts), [./src/lib/axios/parser/pathParser.ts](./src/lib/axios/parser/pathParser.ts), [./src/lib/axios/parser/queryParser.ts](./src/lib/axios/parser/queryParser.ts)

Nazwy klas: `URLParser`, `URLPathParser`, `URLQueryParser`

Cel wykorzystania: Dwie klasy posiadające nieznacznie różniące się parsery URL implementują tę samą metodę z abstrakcyjnej klasy nadrzędnej. Dzięki temu w zależności od sytuacji możliwy jest wybór parsera a kod klas implementujacych jest czytelny oraz jest łatwa możliwość dodania nowych parserów.

Przykład wykorzystania: [./src/lib/axios/index.ts](./src/lib/axios/index.ts)

### Wzorce strukturalne

#### Facade

Stworzony w: [./src/lib/text.ts](./src/lib/text.ts)

Nazwa klasy: `TextFormatter`

Cel wykorzystania: Zastąpienie samotnych funkcji klasą fasady, która uprościła strukturę kodu a także dostęp do poszczególnych metod. Kod jest lepiej zorganizowany oraz istnieje możliwość dodawania kolejnych funkcjonalności w klasie.

Przykład wykorzystania: [./src/modules/admin/users/utils/columns.tsx](./src/modules/admin/users/utils/columns.tsx)

#### Flyweight

Stworzony w: [./src/lib/color/factory.ts](./src/lib/color/factory.ts)

Nazwy klas: `ColorFactory` `<>->` `Color`

Cel wykrozystania: Przechowywanie listy kolorów w obiekcie klasy `ColorFactory` aby zapobiec powtarzającemu tworzeniu obiektów tego samego koloru. Wywołując konstruktor klasy `Color` dla tego samego koloru tworzymy takie same obiekty klas które zachowują się identycznie. W przypadku korzystania z `ColorFactory` obiekty tego samego koloru są wykorzystywane ponownie.

Przykład wykorzystania: [./src/modules/admin/users/components/index.tsx](./src/modules/admin/users/components/index.tsx)
