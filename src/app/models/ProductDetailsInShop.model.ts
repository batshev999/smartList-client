import { IProduct } from "./product.model";

export interface IProductDetailsInShop extends IProduct {
readonly productId : number;
readonly shopListId : number;
readonly amount : number;
}
