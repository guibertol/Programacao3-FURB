<?php

namespace Artico\Defender\Providers;

use Artico\Defender\Role;
use Artico\Defender\Defender;
use Artico\Defender\Javascript;
use Artico\Defender\Permission;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;
use Artico\Defender\Repositories\Eloquent\EloquentRoleRepository;
use Artico\Defender\Repositories\Eloquent\EloquentUserRepository;
use Artico\Defender\Repositories\Eloquent\EloquentPermissionRepository;

/**
 * Class DefenderServiceProvider.
 */
class DefenderServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     */
    public function boot()
    {
        $this->publishResources();
        $this->publishMigrations();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('defender', function ($app) {
            return new Defender($app, $app['defender.role'], $app['defender.permission']);
        });

        $this->app->singleton('defender.auth', function ($app) {
            return $app['auth'];
        });

        $this->app->bind('defender.javascript', function ($app) {
            return $app['defender']->javascript();
        });

        $this->app->alias('defender', 'Artico\Defender\Contracts\Defender');

        $this->app->alias('defender.javascript', 'Artico\Defender\Contracts\Javascript');

        $this->registerRepositoryInterfaces();

        $this->registerBladeExtensions();

        $this->loadHelpers();

        $this->registerCommands();
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['defender', 'defender.role', 'defender.permission', 'defender.user'];
    }

    /**
     * Bind repositories interfaces with their implementations.
     */
    protected function registerRepositoryInterfaces()
    {
        $this->app->singleton('defender.role', function ($app) {
            return new EloquentRoleRepository($app, new Role());
        });

        $this->app->singleton('Artico\Defender\Contracts\Repositories\RoleRepository', function ($app) {
            return $app['defender.role'];
        });

        $this->app->singleton('defender.permission', function ($app) {
            return new EloquentPermissionRepository($app, new Permission());
        });

        $this->app->singleton('Artico\Defender\Contracts\Repositories\PermissionRepository', function ($app) {
            return $app['defender.permission'];
        });

        $this->app->singleton('defender.user', function ($app) {
            $userModel = $app['config']->get('auth.model', 'App\User');
            return new EloquentUserRepository($app, $app->make($userModel));
        });

        $this->app->singleton('Artico\Defender\Contracts\Repositories\UserRepository', function ($app) {
            return $app['defender.user'];
        });
    }

    /**
     * Register new blade extensions.
     */
    protected function registerBladeExtensions()
    {
        if (false === $this->app['config']->get('defender.template_helpers', true)) {
            return;
        }

        $this->app->afterResolving('blade.compiler', function (BladeCompiler $bladeCompiler) {
            /*
             * add @shield and @endshield to blade compiler
             */
            $bladeCompiler->directive('shield', function ($expression) {
                return "<?php if(app('defender')->canDo{$expression}): ?>";
            });

            $bladeCompiler->directive('endshield', function ($expression) {
                return '<?php endif; ?>';
            });

            /*
             * add @is and @endis to blade compiler
             */
            $bladeCompiler->directive('is', function ($expression) {
                return "<?php if(app('defender')->hasRoles{$expression}): ?>";
            });

            $bladeCompiler->directive('endis', function ($expression) {
                return '<?php endif; ?>';
            });
        });
    }

    /**
     * Publish configuration file.
     */
    private function publishResources()
    {
        $this->publishes([__DIR__ . '/../../resources/config/defender.php' => config_path('defender.php')], 'config');
        $this->mergeConfigFrom(__DIR__ . '/../../resources/config/defender.php', 'defender');
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'defender');
    }

    /**
     * Publish migration file.
     */
    private function publishMigrations()
    {
        $this->publishes([__DIR__ . '/../../resources/migrations/' => base_path('database/migrations')], 'migrations');
    }

    /**
     * Load the helpers file.
     */
    private function loadHelpers()
    {
        if ($this->app['config']->get('defender.helpers', true)) {
            /*
             * That needs to be required inside that condition,
             * otherwise will have a side effect, will be always required.
             */
            require_once __DIR__ . '/../helpers.php';
        }
    }

    /**
     * Register the commands.
     */
    private function registerCommands()
    {
        $this->commands('Artico\Defender\Commands\MakeRole');
        $this->commands('Artico\Defender\Commands\MakePermission');
    }
}
