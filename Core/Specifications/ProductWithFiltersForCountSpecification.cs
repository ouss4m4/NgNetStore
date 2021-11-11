using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecParams specs)
            : base(x =>
                (string.IsNullOrEmpty(specs.Search) || x.Name.ToLower().Contains(specs.Search)) &&
                (!specs.BrandId.HasValue || x.ProductBrandId == specs.BrandId) &&
                (!specs.TypeId.HasValue || x.ProductTypeId == specs.TypeId)
            )
        {

        }
        /* public ProductsWithTypesAndBrandsSpecification */
    }
}