/**
 * {@link Spot} の状態一覧
 */
export const spotImageTypes = ['locked', 'unvisited', 'disabled', 'normal'] as const

/**
 * {@link Spot} の状態一覧
 */
export type SpotImageTypes = typeof spotImageTypes[number]

/**
 * {@link Spot} の各種状態において表示に利用する画像アセット.
 */
export interface SpotImageConfig {
  /**
   * 未解放状態の画像アセット.
   *
   * プレイヤーには存在を見せたいが、条件をみたすまで
   * 訪問させたくない Spot を作成したいときに設定してください.
   */
  locked: g.ImageAsset
  /**
   * 未訪問状態の画像アセット.
   *
   * プレイヤーがまだ訪問していない場合、
   * 強調表示をして訪問を促したい際に設定してください.
   */
  unvisited: g.ImageAsset
  /**
   * 訪問操作受付禁止状態の画像アセット.
   *
   * プレイヤーが他の Spot に向かって移動しているときなど、
   * クリックしても目的地に指定できないことを強調する際に設定してください.
   */
  disabled: g.ImageAsset
  /**
   * 通常時の画像アセット.
   *
   * プレイヤーがクリックすれば目的地に設定される状態の際の画像を設定してください.
   */
  normal: g.ImageAsset
}
