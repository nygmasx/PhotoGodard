<?php

namespace App\Controller\Admin;

use App\Entity\Photo;
use App\Form\PhotoType;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin/photo')]
class PhotoController extends AbstractController
{
    #[Route('/', name: 'app_admin_photo_index', methods: ['GET'])]
    public function index(PhotoRepository $photoRepository): Response
    {
        return $this->render('admin/photo/index.html.twig', [
            'photos' => $photoRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_admin_photo_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $photo = new Photo();
        $form = $this->createForm(PhotoType::class, $photo);
        // dd($request);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $photo->setCreatedAt(new \DateTimeImmutable());
            $photo->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($photo);
            $entityManager->flush();

            return $this->redirectToRoute('app_admin_photo_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('admin/photo/new.html.twig', [
            'photo' => $photo,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_admin_photo_show', methods: ['GET'])]
    public function show(Photo $photo): Response
    {
        return $this->render('admin/photo/show.html.twig', [
            'photo' => $photo,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_admin_photo_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Photo $photo, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(PhotoType::class, $photo);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_admin_photo_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('admin/photo/edit.html.twig', [
            'photo' => $photo,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_admin_photo_delete', methods: ['POST'])]
    public function delete(Request $request, Photo $photo, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$photo->getId(), $request->request->get('_token'))) {
            $entityManager->remove($photo);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_admin_photo_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/photos/delete', name: 'app_admin_delete_photos', methods: ['POST'])]
    public function deletePhotos(Request $request, EntityManagerInterface $entityManager, ParameterBagInterface $parameterBag): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Récupérez les ID des photos à supprimer
        $photoIds = $data['photo_ids'] ?? [];

        // Supprimez les photos correspondantes
        foreach ($photoIds as $photoId) {
            $photo = $entityManager->getRepository(Photo::class)->find($photoId);
            if ($photo) {
                // Si la photo est associée à un album
                if ($album = $photo->getAlbum()) {
                    // Supprimer la référence à la photo dans l'album
                    if ($album->getFavoritePhoto() === $photo) {
                        $album->setFavoritePhoto(null);
                    }
                    // Supprimer la référence à la photo dans l'album
                    $album->removePhoto($photo);
                    // Enregistrez les modifications dans l'entité de l'album
                    $entityManager->persist($album);
                    try {
                        unlink($parameterBag->get('kernel.project_dir').'/storage/images/private/'.strtoupper($album->getUniqId()).'/'.$photo->getFilename());
                    } catch (\Exception $e) {
                        continue;
                    }
                }

                // Si la photo est associée à une catégorie
                if ($category = $photo->getCategory()) {
                    // Supprimer la référence à la photo dans la catégorie
                    if ($category->getFavoritePhoto() === $photo) {
                        $category->setFavoritePhoto(null);
                    }
                    // Supprimer la référence à la photo dans la catégorie
                    $category->removePhoto($photo);
                    // Enregistrez les modifications dans l'entité de la catégorie
                    $entityManager->persist($category);
                    try {
                        unlink($parameterBag->get('kernel.project_dir').'/public/photos/public/'.strtoupper($category->getUniqId()).'/'.$photo->getFilename());
                    } catch (\Exception $e) {
                        continue;
                    }
                }

                // Supprimer la photo
                $entityManager->remove($photo);
            }
        }
        // Enregistrez toutes les modifications dans la base de données
        $entityManager->flush();

        // Réponse JSON pour indiquer le succès de l'opération
        return new JsonResponse(['message' => 'Photos deleted successfully']);
    }
}
