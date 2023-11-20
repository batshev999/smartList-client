export interface IProduct {
 readonly id :number;
 readonly categoryId :number;
 readonly companyId :number;
 readonly productName :string;
 readonly isInPackage? :boolean;
 readonly amountInPackage? :number;
 readonly weight? :number;
 readonly weightType? :string;
 readonly img? :string;
 readonly isNew?:boolean;
 readonly amount?:number
}
