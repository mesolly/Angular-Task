import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  localUrl:any[] = [];
  selectedFileName: string ='';
  categories:any[] = ["men's clothing","jewelery","electronics","electronics","others"] ;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public id: any
    ) {
    this.productForm = this.formBuilder.group({
      id: id,
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: [null, Validators.required],
      rating: this.formBuilder.group({
        rate: ['', Validators.required],
        count: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.productForm.valid) {
      const payload = this.productForm.value;
      this.dialogRef.close(payload);
      this.productForm.reset();
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.localUrl = event.target.result;
            this.productForm.patchValue({
              image: this.localUrl
            });
        }
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  onClickCancel(event:any){
    this.dialogRef.close();
  }
}
