using Microsoft.EntityFrameworkCore;

namespace MovieApi.Models
{
    public class MovieContext : DbContext
    {
        public DbSet<UserAccount> UserAccount { get; set; }
        public DbSet<Movie> Movie { get; set; }
        public DbSet<Review> Review { get; set; }
        public DbSet<Actor> Actor { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"
                Server=LPCAIQ1437;
                Database=MovieDB;
                Trusted_Connection=True;
                TrustServerCertificate=True;
            ");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieCast>().HasKey(mc => new { mc.MovieId, mc.ActorId });
        }

    }
}
