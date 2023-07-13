import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '../products.service';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  successStatus: boolean = false;
  msgType:string ='';
  sucessMsg:any;
  categories:any[] = ["men's clothing","jewelery","electronics","electronics","others"] ;

  constructor(
    private productService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.loadProducts(data);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  loadProducts(products: any) {
    this.products = products.map((product: any) => ({
      ...product,
      isEditing: false
    }));
    this.filteredProducts = this.products;
    this.totalItems = products.length;
  }

  toggleEditMode(product: any): void {
    const isOtherProductEditing = this.products.some(p => p.isEditing && p !== product);
    if (!isOtherProductEditing) {
      if (product.isEditing) {
        this.msgType = 'success' ;
        this.successStatus = true ;
        this.sucessMsg = "Product updated succesfully" ;
        setTimeout(() => {
          this.successStatus = false;
          this.sucessMsg = '' ;
        }, 2000);
      }
      product.isEditing = !product.isEditing;
      this.products.forEach(p => {
        if (p !== product) {
          p.isEditing = false;
        }
      });
    }
  }
  

  isUpdateDisabled(product: any): boolean {
    return (
      !product.title ||
      !product.price ||
      !product.description ||
      !product.category ||
      !product.image ||
      product.price <= 0 ||
      product.rating.rate <= 0 ||
      product.rating.count <= 0
    );
  }

  handleImageChange(event: any, product: any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const newImageUrl = event.target.result;
        product.image = newImageUrl;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  

  deleteProduct(product: any): void {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.filteredProducts.splice(index, 1);
      this.totalItems -= 1;
      this.msgType = 'failure' ;
        this.successStatus = true ;
        this.sucessMsg = "Product deleted succesfully" ;
        setTimeout(() => {
          this.successStatus = false;
          this.sucessMsg = '' ;
        }, 2000);
    }
  }

  filterProducts(): void {
    if (this.searchText.trim() === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.totalItems = this.filteredProducts.length;
  }

  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  insertProduct() {
    const newID = Math.max(...this.products.map((p) => p.id)) + 1;
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '490px',
      height: '100vh',
      data: newID
    });

    dialogRef.afterClosed().subscribe((newProduct) => {
      if (newProduct) {
        this.msgType = 'success' ;
        this.successStatus = true ;
        this.sucessMsg = "Product added succesfully" ;
        this.products.push(newProduct);
        this.filterProducts();
        setTimeout(() => {
          this.successStatus = false;
          this.sucessMsg = '' ;
        }, 2000);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
