import { CategoryModel, ICategory } from "../models/category.model";

export class CategoryService {
    static async getAllCategories() {
        return CategoryModel.find().sort({ createdAt: -1 });
    }
    static async getCategoryById(id: string) {
        return CategoryModel.findById(id);
    }
    static async createCategory(data: ICategory) {
        const existingCategory = await this.getCategoryByName(data.name);
        if (existingCategory) {
            throw new Error("Category with this name already exists");
        }
        return CategoryModel.create(data);
    }
    static async deleteCategory(id: string) {
        return CategoryModel.findByIdAndDelete(id);
    }
    static async getCategoryByName(name: string) {
        return CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }
}