// Unified styles export - combines all style modules
// Import individual modules for tree-shaking, or use this for full access

import commonStyles from './common';
import cardStyles from './cards';
import navigationStyles from './navigation';
import formStyles from './forms';
import modalStyles from './modals';
import buttonStyles from './buttons';
import tableStyles from './tables';
import listStyles from './lists';

// Backward compatibility: merge all styles into a single object
// Components that used `Styles.xxx` or `global.Styles.xxx` can import from here
// Fixed typo: cardDelault -> cardDefault, with aliases for backward compat
const Styles = {
  ...commonStyles,
  ...cardStyles,
  ...navigationStyles,
  ...formStyles,
  ...modalStyles,
  ...buttonStyles,
  ...tableStyles,
  ...listStyles,

  // Backward compatibility aliases for the cardDelault typo
  cardDelault: cardStyles.cardDefault,
  cardDelault__active: cardStyles.cardDefault__active,
  cardDelaultRow: cardStyles.cardDefaultRow,
  cardDelaultRowTime: cardStyles.cardDefaultRowTime,
  cardDelaultRowTimeText: cardStyles.cardDefaultRowTimeText,
  cardDelaultRowTitle: cardStyles.cardDefaultRowTitle,
  cardDelaultRowText: cardStyles.cardDefaultRowText,
  cardDelaultRowLine: cardStyles.cardDefaultRowLine,
  cardDelaultGoTo: cardStyles.cardDefaultGoTo,
  cardDelaultGoToText: cardStyles.cardDefaultGoToText,
  cardDelaultRemove: cardStyles.cardDefaultRemove,
  cardDelaultRemoveText: cardStyles.cardDefaultRemoveText,
  cardDelaultBtns: cardStyles.cardDefaultBtns,
  cardDelaultEdit: cardStyles.cardDefaultEdit,
  cardDelaultEditText: cardStyles.cardDefaultEditText,
};

export default Styles;

// Named exports for individual modules
export {default as commonStyles} from './common';
export {default as cardStyles} from './cards';
export {default as navigationStyles} from './navigation';
export {default as formStyles} from './forms';
export {default as modalStyles} from './modals';
export {default as buttonStyles} from './buttons';
export {default as tableStyles} from './tables';
export {default as listStyles} from './lists';
export {COLORS, FONTS, SPACING, RADIUS} from './theme';
