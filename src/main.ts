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

function r(val: number) {
  return Math.round(val * 100) / 100;
}

function getBalance<T extends Person>(expenses: Expense[], people: readonly T[]) {
  return people.map((person) => {
    const positive = expenses
      .filter((expense) => expense.payer_id === person.id)
      .reduce((total, curr) => total + curr.cost, 0);
    const negative = expenses
      .filter((expense) => expense.participant_ids.includes(person.id))
      .reduce(
        (total, contributedExpense) =>
          total + r(contributedExpense.cost / contributedExpense.participant_ids.length),
        0
      );

    return {
      ...person,
      balance: r(positive - negative),
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
        const amount = Math.min(Math.abs(debtor.balance), person.balance);
        incoming = [...incoming, { id: debtor.id, amount }];
        debtor.balance = r(debtor.balance + amount);
        debtor.outgoing = [...(debtor.outgoing ?? []), { id: person.id, amount }];
        person.balance = r(person.balance - amount);
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
      return people.find((p) => p.name === name)?.id ?? 1;
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
        name: 'Koekjes en 🥐',
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
          i('Mieke'),
          i('Monique'),
          i('Sandra'),
          i('Nico'),
          i('Suzanne'),
          i('Tim'),
        ],
        payer_id: i('Nico'),
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
          balance: 129.38,
        },
        {
          id: 2,
          name: 'Jaap',
          balance: -159.62,
        },
        {
          id: 3,
          name: 'Martijn',
          balance: -78.06,
        },
        {
          id: 4,
          name: 'Tim',
          balance: -183.62,
        },
        {
          id: 5,
          name: 'Dennis',
          balance: -155.62,
        },
        {
          id: 6,
          name: 'Suzanne',
          balance: -183.62,
        },
        {
          id: 7,
          name: 'Evelien',
          balance: -159.62,
        },
        {
          id: 8,
          name: 'Max',
          balance: -153.88,
        },
        {
          id: 9,
          name: 'Nico',
          balance: 203.47,
        },
        {
          id: 10,
          name: 'Sandra',
          balance: -123.62,
        },
        {
          id: 11,
          name: 'Mieke',
          balance: -159.62,
        },
        {
          id: 12,
          name: 'Hans',
          balance: 1024.38,
        },
      ]);

      const result = getResult(balance);

      expect(result).toEqual([
        {
          id: 1,
          name: 'Monique',
          balance: 0,
          incoming: [
            {
              id: 2,
              amount: 129.38,
            },
          ],
        },
        {
          id: 2,
          balance: 0,
          name: 'Jaap',
          outgoing: [
            {
              amount: 129.38,
              id: 1,
            },
            {
              amount: 30.24,
              id: 9,
            },
          ],
        },
        {
          id: 3,
          balance: 0,
          name: 'Martijn',
          outgoing: [
            {
              amount: 78.06,
              id: 9,
            },
          ],
        },
        {
          id: 4,
          balance: 0,
          name: 'Tim',
          outgoing: [
            {
              amount: 95.17,
              id: 9,
            },
            {
              amount: 88.45,
              id: 12,
            },
          ],
        },
        {
          id: 5,
          balance: 0,
          name: 'Dennis',
          outgoing: [
            {
              amount: 155.62,
              id: 12,
            },
          ],
        },
        {
          id: 6,
          balance: 0,
          name: 'Suzanne',
          outgoing: [
            {
              amount: 183.62,
              id: 12,
            },
          ],
        },
        {
          id: 7,
          balance: 0,
          name: 'Evelien',
          outgoing: [
            {
              amount: 159.62,
              id: 12,
            },
          ],
        },
        {
          id: 8,
          balance: 0,
          name: 'Max',
          outgoing: [
            {
              amount: 153.88,
              id: 12,
            },
          ],
        },
        {
          id: 9,
          balance: 0,
          name: 'Nico',
          incoming: [
            {
              amount: 30.24,
              id: 2,
            },
            {
              amount: 78.06,
              id: 3,
            },
            {
              amount: 95.17,
              id: 4,
            },
          ],
        },
        {
          id: 10,
          balance: 0,
          name: 'Sandra',
          outgoing: [
            {
              amount: 123.62,
              id: 12,
            },
          ],
        },
        {
          id: 11,
          balance: -0.05,
          name: 'Mieke',
          outgoing: [
            {
              amount: 159.57,
              id: 12,
            },
          ],
        },
        {
          id: 12,
          name: 'Hans',
          balance: 0,
          incoming: [
            {
              id: 4,
              amount: 88.45,
            },
            {
              id: 5,
              amount: 155.62,
            },
            {
              amount: 183.62,
              id: 6,
            },
            {
              amount: 159.62,
              id: 7,
            },
            {
              amount: 153.88,
              id: 8,
            },
            {
              amount: 123.62,
              id: 10,
            },
            {
              amount: 159.57,
              id: 11,
            },
          ],
        },
      ]);
      const debtorSum = balance
        .filter((p) => p.balance < 0)
        .reduce((total, debtor) => total + Math.abs(debtor.balance), 0);
      const creditorSum = balance
        .filter((p) => p.balance >= 0)
        .reduce((total, debtor) => total + debtor.balance, 0);

      expect(debtorSum - creditorSum).toBeLessThanOrEqual(0.05);
    });
  });
}

export {};
