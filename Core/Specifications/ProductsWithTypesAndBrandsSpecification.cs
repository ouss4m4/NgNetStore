using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams specs)
            : base(x =>
                (string.IsNullOrEmpty(specs.Search) || x.Name.ToLower().Contains(specs.Search)) &&
                (!specs.BrandId.HasValue || x.ProductBrandId == specs.BrandId) &&
                (!specs.TypeId.HasValue || x.ProductTypeId == specs.TypeId)
            )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name);
            ApplyPaging(specs.PageSize * (specs.PageIndex - 1), specs.PageSize);


            if (!string.IsNullOrEmpty(specs.Sort))
            {

                switch (specs.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(p => p.Name);
                        break;
                };
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }

    }
}