export enum Color {
  MAIN_BACKGROUND = '#16172B',
  MAIN_BLACK = '#000000',
  MAIN_COBALT = '#00339B',
  MAIN_CYAN = '#00CCFF',
  MAIN_EMBER = '#FF2899',
};

export enum RouteName {
  CONTRACTS = 'contracts',
  CONTRACT_META_DATA = 'metadata',
  DEPLOYED_CONTRACTS = 'deployed',
  REGISTER_CONTRACT = 'register',
  CONTRACT_DETAIL = ':contractId',
  DEPLOYED_DETAIL = ':deployedId',

  CHAINS = 'chains',
  CHAIN_META_DATA = 'meta_chains',
  CHAIN_DETAIL = ':chainSeq',

  DEPLOY_CONTRACT = 'deploy',
};
