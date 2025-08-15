import { mapWordnikWordOfTheDayToModel, type NormalizedWordOfTheDay } from '@/lib/wordnik';

describe('mapWordnikWordOfTheDayToModel', () => {
  it('maps happy path with multiple definitions and top-level example', () => {
    const input = {
      word: 'eloquent',
      definitions: [
        { text: 'Fluent or persuasive in speaking or writing.', partOfSpeech: 'adjective' },
        { text: 'Clearly expressing or indicating something.' },
      ],
      examples: [
        { text: 'She gave an eloquent speech.' },
        { text: 'His gestures were eloquent.' },
      ],
    };

    const mapped = mapWordnikWordOfTheDayToModel(input)!;
    expect(mapped.word).toBe('eloquent');
    expect(mapped.definition).toBe('Fluent or persuasive in speaking or writing.');
    expect(mapped.partOfSpeech).toBe('adjective');
    expect(mapped.example).toBe('She gave an eloquent speech.');
  });

  it('maps when only definition-level example is present', () => {
    const input = {
      word: 'abstruse',
      definitions: [
        {
          text: 'Difficult to understand; obscure.',
          partOfSpeech: 'adjective',
          exampleUses: [{ text: 'An abstruse philosophical inquiry.' }],
        },
      ],
    };

    const mapped = mapWordnikWordOfTheDayToModel(input)!;
    expect(mapped.word).toBe('abstruse');
    expect(mapped.definition).toBe('Difficult to understand; obscure.');
    expect(mapped.partOfSpeech).toBe('adjective');
    expect(mapped.example).toBe('An abstruse philosophical inquiry.');
  });

  it('handles missing definitions gracefully', () => {
    const input = {
      word: 'zeitgeist',
      definitions: [],
      examples: [{ text: 'The novel captures the zeitgeist of the 1990s.' }],
    };

    const mapped = mapWordnikWordOfTheDayToModel(input)!;
    expect(mapped.word).toBe('zeitgeist');
    expect(mapped.definition).toBeUndefined();
    expect(mapped.partOfSpeech).toBeUndefined();
    expect(mapped.example).toBe('The novel captures the zeitgeist of the 1990s.');
  });

  it('returns null when input is null or missing word', () => {
    expect(mapWordnikWordOfTheDayToModel(null)).toBeNull();
    expect(mapWordnikWordOfTheDayToModel(undefined)).toBeNull();
    expect(mapWordnikWordOfTheDayToModel({ definitions: [] } as any)).toBeNull();
  });
});


