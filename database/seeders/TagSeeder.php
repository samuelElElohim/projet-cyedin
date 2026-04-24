<?php

namespace Database\Seeders;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = ['backend', 'frontend', 'fullstack', 'mobile', 'devops', 'data', 'design', 'ia'];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(['nom' => $tag]);
        }
    }
}