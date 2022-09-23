type Person = {
  id: number;
  name: string;
};

type Expense = {
  name: string;
  participant_ids: number[];
  payer_id: number;
  cost: number;
};

type PeopleWithData = Person & {
  balance: number;
  incoming?: { id: number; amount: number }[];
  outgoing?: { id: number; amount: number }[];
};

function getBalance<T extends Person>(expenses: Expense[], people: readonly T[]) {
  return people.map((person) => {
    const positive = expenses
      .filter((expense) => expense.payer_id === person.id)
      .reduce((total, curr) => total + curr.cost, 0);
    const negative = expenses
      .filter((expense) => expense.participant_ids.includes(person.id))
      .reduce(
        (total, contributedExpense) =>
          total +
          Math.round((contributedExpense.cost / contributedExpense.participant_ids.length) * 100) /
            100,
        0
      );

    if (person.name === 'Tim') {
      console.log(
        expenses
          .filter((expense) => expense.participant_ids.includes(person.id))
          .reduce((total, contributedExpense) => {
            const cost = contributedExpense.cost / contributedExpense.participant_ids.length;

            return total + cost;
          }, 0)
      );
    }
    return {
      ...person,
      balance: Math.round((positive - negative) * 100) / 100,
    };
  });
}

function getResult(people: PeopleWithData[]) {
  return people.map((person) => {
    if (person.balance <= 0) {
      return person;
    }
    const debtors = people.filter((p) => p.balance < 0);

    let incoming: { id: number; amount: number }[] = [];

    debtors.forEach((debtor) => {
      if (person.balance > 0 && debtor.balance < 0) {
        const amount = Math.abs(Math.max(debtor.balance, person.balance));
        incoming = [...incoming, { id: debtor.id, amount }];
        debtor.balance += amount;
        debtor.outgoing = [...(debtor.outgoing ?? []), { id: person.id, amount }];
        person.balance -= amount;
      }
    });

    return {
      ...person,
      incoming,
    };
  });
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe.skip('simple', () => {
    const people: Person[] = [
      {
        id: 1,
        name: 'User 1',
      },
      {
        id: 2,
        name: 'User 2',
      },
      {
        id: 3,
        name: 'User 3',
      },
    ];

    const expenses: Expense[] = [
      {
        name: 'Biking trip',
        participant_ids: [1, 2, 3],
        payer_id: 1,
        cost: 150,
      },
      {
        name: 'Parachuting',
        participant_ids: [2, 3],
        payer_id: 2,
        cost: 500,
      },
    ];
    it('calculates stuff', () => {
      const balance = getBalance(expenses, people);
      expect(balance).toEqual([
        {
          id: 1,
          name: 'User 1',
          balance: 100,
        },
        {
          id: 2,
          name: 'User 2',
          balance: 200,
        },
        {
          id: 3,
          name: 'User 3',
          balance: -300,
        },
      ]);
      const result = getResult(balance);

      expect(result).toEqual([
        {
          id: 1,
          name: 'User 1',
          balance: 0,
          incoming: [{ id: 3, amount: 100 }],
        },
        {
          id: 2,
          name: 'User 2',
          balance: 0,
          incoming: [{ id: 3, amount: 200 }],
        },
        {
          id: 3,
          name: 'User 3',
          balance: 0,
          outgoing: [
            { id: 1, amount: 100 },
            { id: 2, amount: 200 },
          ],
        },
      ]);
    });
  });

  describe('Belgie', () => {
    const people = [
      {
        id: 1,
        name: 'Monique',
      },
      {
        id: 2,
        name: 'Jaap',
      },
      {
        id: 3,
        name: 'Martijn',
      },
      {
        id: 4,
        name: 'Tim',
      },
      {
        id: 5,
        name: 'Dennis',
      },
      {
        id: 6,
        name: 'Suzanne',
      },
      {
        id: 7,
        name: 'Evelien',
      },
      {
        id: 8,
        name: 'Max',
      },
      {
        id: 9,
        name: 'Nico',
      },
      {
        id: 10,
        name: 'Sandra',
      },
      {
        id: 11,
        name: 'Mieke',
      },
      {
        id: 12,
        name: 'Hans',
      },
    ] as const;

    function i(name: typeof people[number]['name']) {
      return people.find((p) => p.name === name)!.id;
    }

    const expenses: Expense[] = [
      {
        name: 'Drinken van picnic',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Monique'),
        cost: 289,
      },
      {
        name: 'Accommodatie',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Hans'),
        cost: 1058,
      },
      {
        name: 'drinken',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Dennis'),
        cost: 15,
      },
      {
        name: 'koekjes en 🥐',
        participant_ids: [i('Mieke')],
        payer_id: i('Mieke'),
        cost: 10.5,
      },
      {
        name: 'Picnic boodschappen',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Hans'),
        cost: 126,
      },
      {
        name: 'Benzine',
        participant_ids: [i('Dennis'), i('Martijn'), i('Suzanne'), i('Tim')],
        payer_id: i('Martijn'),
        cost: 83,
      },
      {
        name: 'entree wildpark',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Sandra'),
        cost: 36,
      },
      {
        name: 'Vleesplankje + Bier + fooi Le Coin Gourmand',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Nico'),
        cost: 300,
      },
      {
        name: 'Briketten + drankjes',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Martijn'),
        cost: 22.56,
      },
      {
        name: 'LIDL bier en boodschappen',
        participant_ids: [
          i('Dennis'),
          i('Evelien'),
          i('Hans'),
          i('Jaap'),
          i('Martijn'),
          i('Max'),
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Sandra'),
        cost: 63.09,
      },
      {
        name: 'maccie milkshakes',
        participant_ids: [i('Dennis'), i('Martijn'), i('Suzanne'), i('Tim')],
        payer_id: i('Dennis'),
        cost: 13,
      },
    ];

    it('calculates stuff', () => {
      const balance = getBalance(expenses, people);

      expect(balance).toEqual([
        {
          id: 1,
          name: 'Monique',
          balance: 129.86,
        },
        {
          id: 2,
          name: 'Jaap',
          balance: -159.14,
        },
        {
          id: 3,
          name: 'Martijn',
          balance: -77.58,
        },
        {
          id: 4,
          name: 'Tim',
          balance: -183.14,
        },
        {
          id: 5,
          name: 'Dennis',
          balance: -155.14,
        },
        {
          id: 6,
          name: 'Suzanne',
          balance: -183.14,
        },
        {
          id: 7,
          name: 'Evelien',
          balance: -159.14,
        },
        {
          id: 8,
          name: 'Max',
          balance: -159.14,
        },
        {
          id: 9,
          name: 'Nico',
          balance: 140.86,
        },
        {
          id: 10,
          name: 'Sandra',
          balance: -60.05,
        },
        {
          id: 11,
          name: 'Mieke',
          balance: -159.14,
        },
        {
          id: 12,
          name: 'Hans',
          balance: 1024.86,
        },
      ]);
      const result = getResult(balance);
      console.log(result);
      // expect(result).toEqual([]);
    });
  });
}

export {};
