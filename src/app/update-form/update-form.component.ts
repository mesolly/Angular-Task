import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.scss']
})
export class UpdateFormComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setInitialValues();
  }

  buildForm(): void {
    this.updateForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  setInitialValues(): void {
    const product = this.data.product;
    this.updateForm.patchValue({
      title: product.title,
      price: product.price,
    });
  }

  submitUpdate(): void {
    if (this.updateForm.valid) {
      this.data.product.title = this.updateForm.value.title ;
      this.data.product.price = this.updateForm.value.price ;
      this.dialogRef.close(this.data);
    }
  }
}
