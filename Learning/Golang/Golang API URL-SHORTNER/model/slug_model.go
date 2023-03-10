package model

import "github.com/yuricorredor/url-shortener/initializers"

type Slug struct {
	CommomModelFields
	Redirect string `gorm:"type:varchar(255);not null" json:"redirect"`
	Slug     string `gorm:"type:varchar(255);not null;unique" json:"slug"`
	Clicks   int    `gorm:"type:int" json:"clicks"`
	Random   bool   `gorm:"type:bool;not null;default:true" json:"random"`
}

func GetAllSlugs() ([]Slug, error) {
	var slugs []Slug
	result := initializers.DB.Find(&slugs)

	return slugs, result.Error
}

func GetSlugBySlug(id uint64) (Slug, error) {
	var slug Slug
	result := initializers.DB.Where("id = ?", id).First(&slug)

	return slug, result.Error
}

func CreateSlug(slug *Slug) error {
	result := initializers.DB.Create(&slug)

	return result.Error
}

func UpdateSlug(slug *Slug) error {
	result := initializers.DB.Save(&slug)

	return result.Error
}

func DeleteSlug(id uint64) error {
	result := initializers.DB.Unscoped().Delete(&Slug{}, id)

	return result.Error
}

func GetUrlBySlug(slugString string) (Slug, error) {
	var slug Slug
	result := initializers.DB.Where("slug = ?", slugString).First(&slug)

	return slug, result.Error
}
