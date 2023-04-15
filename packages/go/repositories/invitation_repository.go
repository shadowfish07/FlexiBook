package repositories

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
	"github.com/shadowfish07/FlexiBook/utils"
)

type InvitationRepository struct {
	oauth *storage.Oauth
}

func NewInvitationRepository(oauth *storage.Oauth) *InvitationRepository {
	return &InvitationRepository{
		oauth: oauth,
	}
}

func (ir *InvitationRepository) GetAll() ([]models.Invitation, error) {
	oauth, err := ir.oauth.Get()
	if err != nil {
		return nil, err
	}

	return oauth.Invitations, nil
}

func (ir *InvitationRepository) Get(id string) (*models.Invitation, error) {
	invitations, err := ir.GetAll()
	if err != nil {
		return nil, err
	}

	for _, invitation := range invitations {
		if invitation.Id == id {
			return &invitation, nil
		}
	}

	return nil, errors.New("Invitation not found")
}

func (ir *InvitationRepository) Update(invitation *models.Invitation) error {
	oauth, err := ir.oauth.Get()
	if err != nil {
		return err
	}

	for i, item := range oauth.Invitations {
		if item.Id == invitation.Id {
			oauth.Invitations[i] = *invitation
			break
		}
	}

	return ir.oauth.Save(oauth)
}

func (ir *InvitationRepository) Add(invitation *models.Invitation) error {
	oauth, err := ir.oauth.Get()
	if err != nil {
		return err
	}

	oauth.Invitations = append(oauth.Invitations, *invitation)

	return ir.oauth.Save(oauth)
}

func (ir *InvitationRepository) Delete(id string) error {
	invitation, err := ir.Get(id)
	if err != nil {
		return err
	}

	timestamp := utils.GetTimestamp()
	invitation.DeletedAt = &timestamp

	return ir.Update(invitation)
}

func (ir *InvitationRepository) AddUsageHistory(history *models.InvitationUsageHistory) error {
	oauth, err := ir.oauth.Get()
	if err != nil {
		return err
	}

	oauth.InvitationUsageHistories = append(oauth.InvitationUsageHistories, *history)

	return ir.oauth.Save(oauth)
}

func (ir *InvitationRepository) GetAllUsageHistories() ([]models.InvitationUsageHistory, error) {
	oauth, err := ir.oauth.Get()
	if err != nil {
		return nil, err
	}

	return oauth.InvitationUsageHistories, nil
}
