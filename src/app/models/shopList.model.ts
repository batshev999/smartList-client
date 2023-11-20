import { IProductDetailsInShop } from "./ProductDetailsInShop.model";

export interface IShopList {
    readonly userId :number;
    readonly date :Date;
    readonly productDetailsInShops :IProductDetailsInShop[],
    readonly isUsedSatistic:boolean
}