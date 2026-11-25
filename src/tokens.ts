/**
 * One step of a type scale: the size in px and the line height in px.
 * Sanity UI derives the rest (cap-height trimming, icon size) from these two.
 */
export interface TypeStep {
  fontSize: number
  lineHeight: number
}

/**
 * The design decisions Uplift applies to a Studio theme.
 *
 * Every value maps onto a Sanity UI scale, indexed the same way as the
 * `space={n}` and `size={n}` props Studio components use, so each step keeps
 * its meaning and only its value changes.
 */
export interface UpliftTokens {
  /**
   * The spacing scale in px, ten steps. Index 0 must stay `0`.
   * Sanity default: `[0, 4, 8, 12, 20, 32, 52, 84, 136, 220]`.
   */
  space: number[]
  /**
   * The `Text` scale, five steps (`size={0}` to `size={4}`). Step 1 is the
   * body text of the Studio: field titles, inputs, lists.
   * Sanity default: 10/15, 13/19, 15/23, 18/27, 21/31.
   */
  text: TypeStep[]
}

/**
 * Roomier and more readable than the Sanity default, for editors who are not
 * developers: body text from 13px to 14px, small text from 10px to 11px, and
 * the middle spacing steps opened up so fields and controls breathe.
 */
export const comfortable: UpliftTokens = {
  space: [0, 4, 8, 14, 22, 36, 56, 88, 136, 220],
  text: [
    {fontSize: 11, lineHeight: 16},
    {fontSize: 14, lineHeight: 21},
    {fontSize: 16, lineHeight: 24},
    {fontSize: 18, lineHeight: 27},
    {fontSize: 21, lineHeight: 31},
  ],
}
