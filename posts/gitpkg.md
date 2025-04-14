# Gitpkg Version 1


Toute OS nécessite un package manager, pour trouver et télécharger des programmes. Je vais donc en créer un pour cette infamie. `gitpkg` sera un wrapper basique autour de `git` qui permet de **chercher, lire et cloner** des dépôts GitHub — tout ça depuis le TTY disponible à [gitpkg](https://github.com/Dulinniel/gitpkg)

---
## Syntaxe de la commande

```bash
gitpkg search <keyword>     # Rechercher des dépôts GitHub par mot-clé
gitpkg read <repo>          # Afficher le README.md d’un repo
gitpkg see <repo>           # Ouvrir le repo dans lynx ou w3m
gitpkg get <repo>           # Cloner le repo avec git
gitpkg help                 # Affiche ce message d’aide
```
## Fonctionnalités 

| Feature                 | Détail                                                     |
| ----------------------- | ---------------------------------------------------------- |
| Fetch                   | Accéder à l'API de Github et trouver des repos             |
| Visualisation README    | Afficher le README d'un repo, s'il existe                  |
| Visualisation dans lynx | Donner la possibilité d'ouvrir le repo dans Lynks ou autre |
| Téléchargement          | `git clone`                                                |
| GUI                     | Non.                                                       |
### Fetch

Pour fetch, on utilisera juste l'API de github en RAW ( Vu l'usage, pas besoin de secret ) Techniquement on peut l'écrire avec `curl`.

```bash
curl -s "https://api.github.com/search/repositories?q=<Query>&per_page=<Int>"
```

Comme j'ai la flemme de coder un parser de JSON, je vais partir sur des programmes de base avec `grep` et `cut` pour récupérer ce que je veux. Donc à la fin on aurait un truc comme  :

```bash
curl -s "https://api.github.com/search/repositories?q=<Query>&per_page=<Int>" | grep "full_name" | cut -d '"' -f 4
```

> *Vu le projet, il sera nécessaire de coder moi même un équivalent de cut et grep*

en terme de code on pourrait voir ça :

```c
#include <stdlib.h>
#include <stdio.h>

#define MAX_REPO_PER_PAGE 5

void fetch(const char* query)
{
  char command[512];
  // Unsafe code goes BRRRRRT
  snprintf(command, sizeof(command), "curl -s \"https://api.github.com/search/repositories?q=%s&per_page=%d%\" | grep \"full_name\" | cut -d '\"' -f 4", query, MAX_REPO_PER_PAGE);
  puts(command);
  // Unsage I know
  system(command);
}
```

L'approche est complètement unsafe, je veux dire, je laisse l'utilisateur entrer ce qu'il veut sans même vérifier si ce qu'il entre ne va pas créer une segfault... Et je ne parle pas du fait que dans ce contexte, il peut plus ou moins exécuter ce qu'il veut. Mais bon, c'est un  prototype. 
### Visualisation  README

Pour visualiser le README, quand on a le repo, il suffit juste d'aller chercher le README depuis l'API GitHub. Pas besoin de vérifier, Curl écrit de lui même s'il y a une erreur HTTP, ce qui est utile si le README n'existe pas  Avec `curl` on aura un truc comme : 

```bash
curl -s "https://raw.githubusercontent.com/<Repo>/master/README.md" | cat
```

J'aurais voulu utiliser `less`, mais il ne peut pas lire de fichiers `md` sans config. Et cette config ne semble pas fonctionner dans un pipe ( Aucune idée de pourquoi ) 

> *Maintenant, je pourrais totalement coder mon tool pour afficher dans le terminal des fichiers*

En terme de code on pourrait voir un truc dans le genre : 

```c
#include <stdlib.h>
#include <stdio.h>

void see_readme(const char* repo)
{
  char command[512];
  // Unsafe is back
  snprintf(command, sizeof(command), "curl -s \"https://raw.githubusercontent.com/%s/master/README.md\" | cat", repo);
  puts(command);
  system(command);
  // Ajoute juste un saut de ligne à la fin, car s'il n'y est pas, cat ne vas      pas le mettre
  printf("\n\0");
}
```

### Visualisation du Repo

Ok, si besoin il peut être utile de voir le repo dans Lynx ou n'importe quel navigateur intégré dans une shell. Par défaut, je vais utiliser lynx car.... J'aime lynx, mais au moment de compiler le projet, il est toujours possible de changer lynx pour autre chose dans le code. Enfin, dans ce cas la visualisation c'est simple : 

```bash
lynx https://github.com/<Repo>
```

Et en terme de code, je spoil un peu mais ce sera la même chose : 

```c
#include <stdlib.h>
#include <stdio.h>

void see_repo(const char* repo)
{
  char command[512];
  // Same stuff everywhere, I think I will make it abstract later on
  snprintf(command, sizeof(command), "lynx https://github.com/%s", repo);
  puts(command);
  system(command);
}
```

Toujours la même chose, mais toujours le même soucis. Au moins, je suis sûre qu'ajouter un peu d'abstraction sera nécessaire. 

### Téléchargement du Repo

La partie la plus simple, le téléchargement. Il y a juste besoin de `git` et de cloner le projet, donc le code sera similaire à celui de visualisation:

```bash
git clone https://github.com/<Repo>.git
```

> *Note à moi même, créer son propre système de git, ça peut être drôle à faire, mais restons sur `git` pour celui-ci*

Et le code 

```c
#include <stdlib.h>
#include <stdio.h>

void download_repo(const char* repo)
{
  char command[512];
  // And now, git clone
  snprintf(command, sizeof(command), "git clone https://github.com/%s.git", repo);
  puts(command);
  system(command);
}
```

## Utilisation

**Input:**
```bash
gitpkg search cargo
```

**Output:** 

```
rust-lang/cargo
mattt/CargoBay
cargo-generate/cargo-generate
javaee/cargotracker
killercup/cargo-edit
```

**Puis:**

```bash
gitpkg read rust-lang/cargo   # Affiche le README
gitpkg get mattt/CargoBay     # Clone le dépôt
cd CargoBay                   # Bravo, vous êtes dans CargoBay 
```
## Sécurité

Bon, maintenant que j'ai fait mon caca il faut au moins sécuriser le merdier. Actuellement, n'importe qui peut faire dépasser le buffer, ou exécuter du code arbitraire 

```bash
gitpkg search "; sudo rm -rf / --no-preserve-root"
```

> *Oui, oui. Actuellement ça c'est possible et ce sera exécuté*

Il faut donc mettre quelques verrous deux précisément. Un qui permette d'exécuter des commandes, mais qui ne soit pas une shell, l'autre qui prenne l'input utilisateur et qui le valide.

### Safe Input

Si j'en crois internet, et l'[Issue 679](https://github.com/moby/moby/issues/679) GitHub accepte les caractères de a à Z, 0 à 9, et quelques caractères spéciaux. Basiquement, ce sont des noms de fichiers POSIX. Ce qui va me simplifier la vie. On pourrait coder cette fonction comme

```c
#include <ctype.h>

int is_safe_input(const char* s)
{
  for ( int i = 0; s[i]; ++i )
  {
	 char c = s[i];
	 if ( !(isalnum(c) || c == '_' || c == '-' || c == '.') )
	 {
		return -1;
	 }
  }
  return 0;
}
```

### Fork

Pour éviter que pelo ne puisse exécuter autre chose, bien que l'input est sanitizer, il pourrait créer des alias tel que : `alias _=":():|:&;"` ce qui, puisque `system` appelle une shell sera interprété comme l'alias ! Donc on va avoir besoin d'une fonction qui crée un fork :D 

```c
#include <unistd.h>

void safe_exec(const char* command, const char args[])
{
  pid_t pid = fork()
  if ( pid < 0 )
  {
	perror("Fork error"); 
    return;
  }

  execvp(command, args);
}
```

Le truc cool, c'est qu'avec les fork on a accès à la démonisation des processus ! Des processus détachés de leurs parents !

```c
// Reminder
const char *arg = "hello";
char *tmp = (char *)arg;
char * const *argv = &tmp;
foo(argv);

```

## TODO

- [ ] Affichage des metadata de repo dans une commande `info`
- [ ] Ajout d'une config pour choisir de chercher sur github, gitlab ou codeberg
- [ ] Ajouter le supports de "pages"
- [ ] Ajouter une config pour choisir le navigateur dans lequel ouvrir le repo 
- [ ] Écrire un vrai parser de JSON
---


![Brain made logo](https://brainmade.org/white-logo.png)
