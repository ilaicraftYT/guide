# Configurar un linter

Como desarrollador, es una buena idea hacer que su proceso de desarrollo sea lo más ágil posible. Instalar y utilizar las herramientas adecuadas es una parte esencial de cualquier proyecto en el que esté trabajando. Aunque no es obligatorio, instalar un linter te ayudará enormemente.

## Instalar un editor de código

Primero, necesitará un editor de código adecuado. Se desaconseja el uso de Bloc de Notas y Notepad++, ya que son ineficientes para proyectos como estos. Si está utilizando cualquiera de las dos, se recomienda cambiar para ahorrarles a todos muchos dolores de cabeza y preguntas innecesarias sobre errores de sintaxis.

* [Visual Studio Code](https://code.visualstudio.com/) es una opción frecuente; es conocido por ser rápido y poderoso. Es compatible con varios idiomas, tiene una terminal, compatibilidad con IntelliSense incorporada y autocompletado para JavaScript y TypeScript. Ésta es la opción recomendada.
* [Atom](https://atom.io/) es fácil de usar, conciso y fácil de navegar. Esto es lo que utilizan muchos desarrolladores para empezar.
* [Sublime Text](https://www.sublimetext.com/) es otro editor popular con el que es fácil de usar y escribir código.

## Instalando un linter

Una de las ventajas significativas que tienen los editores de código adecuados sobre el Bloc de notas y el Notepad++ es su capacidad para usar linters. Linter comprueba la sintaxis y le ayuda a producir un código coherente que sigue reglas de estilo específicas que puede definir usted mismo si así lo desea. Ayudan a formar buenos hábitos si se limita a una sola configuración. Cuando empiece a utilizar un linter, es posible que vea muchos errores; esto es normal y está perfectamente bien. Puede ser difícil pasar durante el proceso inicial, pero definitivamente vale la pena.

Primero, asegúrese de instalar el [paquete ESLint](https://www.npmjs.com/package/eslint) para que lo tengas disponible en tu proyecto.

```bash
npm install eslint --save-dev
```

Luego, instale los complementos apropiados para su editor de elección.

* [ESLint para Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [Linter-ESLint para Atom](https://atom.io/packages/linter-eslint) (requiere [Linter para Atom](https://atom.io/packages/linter))
* [ESLint para Sublime Text](https://packagecontrol.io/packages/ESLint)

::: tip
Puede instalar cada uno de estos directamente dentro de los propios editores. Para Visual Studio Code, presione `Ctrl + Shift + X`. Para Atom, presione `Ctrl + ,` y haga click en `Install`. Para Sublime, presione `Ctrl + Shift + P` y busque `Install Package` (disponible a través de [Package Control](https://packagecontrol.io/installation)). Después de eso, puede buscar el complemento apropiado e instalarlo.
:::

## Configurar reglas de ESLint

ESLint puede mostrar muchas advertencias y errores sobre su código cuando comienza a usarlo, pero no deje que esto lo asuste. Para comenzar, siga estos pasos:

1. Cree un archivo en su directorio raíz llamado `.eslintrc.json` (donde está el archivo principal de su proyecto).
2. Copie el código siguiente en el archivo.

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {

	}
}
```

Esta es la base de cómo se verá un archivo ESLint. El objeto `rules` es donde definirás qué reglas quieres aplicar a ESLint. Por ejemplo, si desea asegurarse de que nunca se requiera un punto y coma, la regla `"semi": [ "error", "never" ]` es lo que querrá agregar dentro de ese objeto.

Puede encontrar una lista de todas las reglas de ESLint en su sitio, ubicado [aquí](https://eslint.org/). De hecho, hay muchas reglas, y puede ser abrumador al principio, pero solo necesitará revisar la lista y definir su archivo una vez.

Alternativamente, si no desea revisar todo uno por uno por su cuenta.

Puede usar una configuración básica:

```json
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {
		"indent": ["error", "tab"],
		"no-console": "off",
		"no-empty-function": "warn",
		"semi": ["error", "never"]
	}
}
```
Los puntos principales de esta configuración serían:

* Permitiéndote depurar con `console.log()`;
* Requerir comillas simples sobre comillas dobles;
* No requerir el punto y coma, dando una advertencia al usarlo;
* Exigir que la sangría se haga con pestañas (tabs);

Si quiere algo mas estricto puede usar el archivo ESLint que usamos para esta guía.

```json {11-45}
{
	"extends": "eslint:recommended",
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 2021
	},
	"rules": {
		"brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": ["error", "always-multiline"],
		"comma-spacing": "error",
		"comma-style": "error",
		"curly": ["error", "multi-line", "consistent"],
		"dot-location": ["error", "property"],
		"handle-callback-err": "off",
		"indent": ["error", "tab"],
		"max-nested-callbacks": ["error", { "max": 4 }],
		"max-statements-per-line": ["error", { "max": 2 }],
		"no-console": "off",
		"no-empty-function": "error",
		"no-floating-decimal": "error",
		"no-inline-comments": "error",
		"no-lonely-if": "error",
		"no-multi-spaces": "error",
		"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"no-shadow": ["error", { "allow": ["err", "resolve", "reject"] }],
		"no-trailing-spaces": ["error"],
		"no-var": "error",
		"object-curly-spacing": ["error", "always"],
		"prefer-const": "error",
		"quotes": ["error", "single"],
		"semi": ["error", "always"],
		"space-before-blocks": "error",
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],
		"space-in-parens": "error",
		"space-infix-ops": "error",
		"space-unary-ops": "error",
		"spaced-comment": "error",
		"yoda": "error"
	}
}
```

Los puntos principales de esta configuración serían:

* Permitiéndote depurar con `console.log()`;
* Prefiere usar `const` sobre `let` o `var`, así como no permitir `var`;
* Desaprobación de variables con el mismo nombre en devoluciones de llamada;
* Requerir comillas simples sobre comillas dobles;
* Requiere punto y coma. Si bien no es obligatorio en JavaScript, se considera una de las mejores prácticas a seguir más comunes.;
* Exigir que las propiedades de acceso estén en la misma línea;
* Exigir que la sangría se haga con pestañas (tabs);
* Limitar las devoluciones de llamada anidadas a 4. Si encuentra este error, es una buena idea considerar refactorizar su código.

Si su estilo de código actual es un poco diferente, o no le gustan algunas de estas reglas, ¡está perfectamente bien! Simplemente diríjase a los [documentos de ESLint](https://eslint.org/docs/rules/), busque las reglas que desea modificar y cámbielas en consecuencia.
