import { Component, OnInit } from '@angular/core';
import { UpdateFormComponent } from '../update-form/update-form.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '../products.service';

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

  constructor(private productService:ProductsService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(
        (data) => {
          this.loadProducts(data);
        },
        error => {
          console.error('Error fetching products:', error);
        }
      );
  }

  loadProducts(products:any){
    this.products = products;
    this.filteredProducts = products;
    this.totalItems = products.length;
  }

  openUpdateForm(product: any): void {
    const dialogRef = this.dialog.open(UpdateFormComponent, {
      width: '490px',
      data: { product },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(updatedProduct => {
      if (updatedProduct) {
        this.updateProduct(updatedProduct);
      }
    });
  }

  updateProduct(updatedProduct: any): void {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.filteredProducts[index] = { ...this.filteredProducts[index], ...updatedProduct };
    }
  }
  
  deleteProduct(product: any): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.filteredProducts.splice(index, 1);
      this.totalItems -= 1;
    }
  }
  

  filterProducts(): void {
    if (this.searchText.trim() === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
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

  insertProduct(){
    const newID = (Math.max(...this.products.map(p => p.id)))+1;
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '490px',
      height: '100vh',
      data: newID,
    });

    dialogRef.afterClosed().subscribe(newProduct => {
      if (newProduct) {
        this.products.push(newProduct) ;
        this.filterProducts();
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
