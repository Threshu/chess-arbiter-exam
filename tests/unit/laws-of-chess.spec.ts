import { describe, expect, it } from 'vitest'
import { citedArticles, lawQuotes } from '~/utils/lawsOfChess'
import lawsPl from '~/data/laws/laws-pl-2023.json'
import lawsEn from '~/data/laws/laws-en-2023.json'

describe('citedArticles', () => {
  it('finds articles and appendices the way the answer keys cite them', () => {
    expect(
      citedArticles(
        'Biały stracił prawo do reklamacji (art. 9.4); bonifikata (art. 7.5.5 w związku z Aneksem A.3) ' +
          'oraz reklamacja do własnego ruchu (A.5.2).',
      ),
    ).toEqual(['9.4', '7.5.5', 'A.3', 'A.5.2'])
  })

  it('reads lists after a single "art."', () => {
    expect(citedArticles('zgodnie z art. 3 i 4 oraz art. 9.2.1 i 9.5.3')).toEqual([
      '9.2.1',
      '9.5.3',
    ])
    expect(citedArticles('(Art. 5.1.1, 5.2.2 or 5.1.2)')).toEqual(['5.1.1', '5.2.2', '5.1.2'])
  })

  it('ignores numbers that are not article citations', () => {
    expect(citedArticles("Tempo 90'+30'', Ru = 1581,25, a 7.3 bez słowa art.")).toEqual([])
  })
})

describe('lawQuotes', () => {
  it('quotes an article with its sub-points and does not repeat a cited sub-point', () => {
    const quotes = lawQuotes(['4.3', '4.3.1'], lawsPl)
    expect(quotes.map((q) => q.number)).toEqual(['4.3', '4.3.1', '4.3.2', '4.3.3'])
  })

  it('puts the lead-in before a sub-point that continues its sentence', () => {
    const quotes = lawQuotes(['9.2.1'], lawsPl)
    expect(quotes.map((q) => q.number)).toEqual(['9.2', '9.2.1'])
  })

  it('skips numbers that are not in the Laws', () => {
    expect(lawQuotes(['99.9'], lawsPl)).toEqual([])
  })

  it('has the 2023 text in both languages under the same number', () => {
    expect(lawsPl['9.4']).toContain('traci w danym posunięciu prawo do reklamacji remisu')
    expect(lawsEn['9.4']).toContain('loses the right to claim a draw')
    expect(lawsPl['A.3']).toContain('jedną minutę zamiast dwóch')
    expect(lawsEn['9.2.3.2']).toContain('castling rights')
    expect(Object.keys(lawsEn).length).toBeGreaterThan(200)
  })
})
